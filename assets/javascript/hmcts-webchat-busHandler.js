(function(root) {
    var STR = {
        YOU_ARE_NOW_CHATTING_WITH: 'You are now chatting with ',
        agentDisconnected: 'This conversation has now ended. Click on the ribbon on the top right if you wish to save a copy of this chat.',
    }
    root.__8x8Chat = {
        onInit: function(bus) {
            bus.publish('chat:set-system-messages', {
                chatEstablishedName: STR.YOU_ARE_NOW_CHATTING_WITH + '{{agent}}. Please type in the window below to start your chat.',
                pullDownInfo: 'Click for options',
                endChatNotification: 'Chat session has been ended.',
                endChatConfirmation: 'Are you sure you want to end this chat conversation?',
                agentDisconnected: STR.agentDisconnected
            });
        }
    };
    function stripHtml(s){
      return s.replace(/(<([^>]+)>)/ig,"")
    }

    function makeDropDown(options, ids) {
      if ( typeof options === 'undefined' || options.length < 2  ){
          return
      }
      if ( jQuery("#selectRadioFake").length>0 ) { 
          return;
      }
      var s = "";
      s += '<label>' + options[0] + '</label>'
      s += '<select aria-label="' + options[0] + '" id="selectRadioFake" onchange="jQuery(\'#\' + this.value).click()" >' +
            '<option disabled selected value="" ></option>'
      for (var i = 0; i < ids.length; ++i) {
          var val = stripHtml(options[i+1]);
        s += '<option value="'+ ids[i] +'">' + val + '</option>'
      }
      s += '</select>';
      return s;
    }

    function prepareDropDown() {
        var li2 = jQuery('.form-list li:nth-child(2)')
        li2.css('height','0px');
        li2.css('overflow','hidden');

        setTimeout( function(){
            var li2 = jQuery('.form-list li:nth-child(2)')
            li2.css('height','0px');
            li2.css('overflow','hidden');
            //
            var optionList = []
            var idList = []
            li2.children("label").each(function(){
                optionList.push( stripHtml(jQuery(this).html() ) );
            })
            li2.children("input[type=radio]").each(function(){
                idList.push( jQuery(this).attr('id'));
            })


            if (idList.length>0){
                var drop = makeDropDown(optionList, idList)
                li2.after(drop)
                resizeChatWindow(0);
            } else {
                prepareDropDown();
            }
        }, 1000 );

    }
  
    function resizeChatWindow(count) {
          
        prepareDropDown()

        setTimeout(function() {

            if ( window.outerHeight < 560 ){
                window.resizeTo(334, 560);
                resizeChatWindow(count+1);
            } else {
                if ( count < 30 ) {
                  resizeChatWindow(count+1);
                }
            }
        }, 1000);
    }
  
    jQuery(document).ready(function() {
        
        prepareDropDown();

        resizeChatWindow(0);
        
        var dropDownVisted = false;

        jQuery('div').on('DOMNodeInserted', '.container', function() {
            adjustDomForAccessibilty();
            validateEmail();
                        
            if ( dropDownVisted===true ) {
                validateDropDown();
            } else {
                jQuery('#selectRadioFake').unbind("blur");
                jQuery('#selectRadioFake').blur(function(){
                    dropDownVisted = true
                    validateDropDown();
                })    
            }

            highlightErroringFields();

            focusFirstError();
        });

        jQuery('div').on('DOMNodeInserted', '.message-wrapper', function(e) {
            if ( jQuery('.chat-log-msg').text().startsWith(STR.YOU_ARE_NOW_CHATTING_WITH)===true ){
                jQuery('.message-box').css('opacity', '1');
            }
            if ( jQuery('.chat-error-msg').text().startsWith(STR.agentDisconnected)===true ){
                jQuery('.message-box').css('opacity', '0');
            }
        });
  
        jQuery('div').on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            jQuery('.message-box').css('opacity', '1');
            jQuery('h1').attr( 'tabindex', '1');
            jQuery('.chat-log-msg').attr( 'tabindex', '0');
  
            var el = jQuery(e.target);
            el.attr('tabindex', '0');
            var pref = 'Your Message: '
            if ( el.hasClass('chat-incoming-msg') ) {
                pref = 'Agent ';
            }
            var str = el.html();
            str = str.replace( /<.*?>/g, '  '  );
  
            el.attr('aria-label', pref + str);
        });
  
        var actionsLock = true;
  
        jQuery('div').on('DOMNodeInserted', '.message-box', function() {
            const wrapper = document.querySelector('.message-box-item');
            addAtributeToField(wrapper, 'aria-label', 'Type your message here');
            addAtributeToField(wrapper, 'placeholder', 'Type your message here');
  
            if ( actionsLock===true ) {
                optionFlagAccessibility();
            }
            actionsLock = false;
  
        });
    });
  
    function getFlagOffsetTop(){
        var visibleActoions = 0;
        jQuery('.actions').children().each(function(){
            jQuery(this).css('display')!=='none'?visibleActoions++:null;
        })
        return (36 * visibleActoions) + 'px';
    }
  
    function optionFlagAccessibility (){
  
        jQuery('.action-clear').remove();
        jQuery('.actions').hide();
  
        var flagTopPx = getFlagOffsetTop();
  
        jQuery('.flag').css('top', flagTopPx);
  
        jQuery('.flag').css('position', 'relative')  ;
  
        jQuery('.flag').click( function(e) {
  
            jQuery('.actions').toggle();
            jQuery('.action-clear').remove();
  
            if ( jQuery('.actions').is(':visible') ) {
                jQuery('.flag').css('top', '0px');
                jQuery('.actions').children(':visible:first').focus()
            } else {
                jQuery('.flag').css('top', flagTopPx);
            }
  
       });
    }
  
    function adjustDomForAccessibilty() {
        const form = document.querySelector('.pre-chat-container .form-list');
        if (form) {
            const listItems = form.children;
            for (const item of listItems) {
                const label = item.getElementsByTagName('label')[0];  
                if (label) {
                    addAtributeToField(item, 'aria-label', label.textContent);
                    addAtributeToField(item, 'placeholder', 'Type here ...');
                    wrapLabelInSpan(label);
                }
                const button = item.getElementsByTagName('button')[0];
                if (button) {
                    addAtributeToField(item, 'aria-label', label.textContent);
                }
            }
        }
    }
  
    function addAtributeToField(item, attribute, value) {
        let field = item.getElementsByTagName('textarea')[0];
  
        if (!field) {
            field = item.getElementsByTagName('input')[0];
        }
  
        field.setAttribute( attribute, value);
    }
  
    function wrapLabelInSpan(label) {
        const newSpan = document.createElement('span');
        const labelNodes = label.childNodes;
  
        for (const item in labelNodes) {
            if (item.nodeType === Node.TEXT_NODE) {
                newSpan.appendChild(document.createTextNode(item.nodeValue));
                label.replaceChild(newSpan, item);
            }
        }
    }
    
    function validateDropDown() {
        var el = jQuery('#selectRadioFake');
        if ( el.val() === null || el.val() === '' ) {
            el.addClass("select-error");
        } else {
            el.removeClass("select-error");
        }
    }  

    function validateEmail() {
        
        const emailField = document.querySelector('input[data-essential="email_id"]');
  
        if (emailField) {
            if (emailField.value !== '' && !isValidEmail(emailField.value)) {
                jQuery(emailField).siblings('label').children('.error-image').css('display', 'inline-block');
            } else {
                jQuery(emailField).siblings('label').children('.error-image').css('display', 'none');
            }
        }
    }
  
    function isValidEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
  
    function highlightErroringFields() {
        const errorImages = document.querySelectorAll('.pre-chat-container .error-image');
  
        if (errorImages) {
            for (const item of errorImages) {
                const field = jQuery(item).parent().siblings('textarea, input')[0];
  
                if (item.style.display === 'inline-block') {
                    jQuery(field).addClass('error');
                } else {
                    jQuery(field).removeClass('error');
                }
            }
        }
    }
  
    function focusFirstError() {
        setTimeout(function() {
            jQuery('textarea.error, input.error').first().focus();
        }, 50);
    }
  })(this);
  