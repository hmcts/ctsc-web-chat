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
      return s.replace(/(<([^>]+)>)/ig,'')
    }

    function makeDropDown(options, ids) {
      if ( typeof options === 'undefined' || options.length < 2  ){
          return
      }
      if ( jQuery('#selectRadioFake').length>0 ) { 
          return; // return if already made
      }
      var s = '';
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

    function hasPreChatDropDown() {
        return jQuery('[data-identifier=droplist-radio-q1]').length>0
    }
    function fakeHide(el) {
        if ( el.length>0 ) {
            el.css('overflow', 'hidden');
            el.css('height', '0px');
            el.css('opacity', '0');
            el.css('position', 'absolute');
            el.css('top', '-1000px');
        }
    }
    var countPrepareDropDown = 0;
    function prepareDropDown() {
        if ( countPrepareDropDown<10 && !hasPreChatDropDown() ) {
            countPrepareDropDown++;
            setTimeout(function(){
                prepareDropDown();
            }, 250 );
            return; // no dropdown on prechat
        }
        var dropdownLi = jQuery('[data-identifier=droplist-radio-q1]:first').parent()

        fakeHide(dropdownLi);

        setTimeout( function() {
            dropdownLi = jQuery('[data-identifier=droplist-radio-q1]:first').parent()
            fakeHide(dropdownLi);

            var optionList = []
            var idList = []
            
            dropdownLi.children('label').each(function(){
                optionList.push( stripHtml(jQuery(this).html() ) );
            });

            jQuery('[data-identifier=droplist-radio-q1]').each(function(){
                idList.push( jQuery(this).attr('id'));
            });

            if ( idList.length > 0 ){
                var drop = makeDropDown(optionList, idList);
                dropdownLi.after(drop);
                setTimeout( function(){
                    if ( jQuery('#selectRadioFake').length>0 ){
                        jQuery('#selectRadioFake').focus();
                        jQuery('#selectRadioFake').blur(function(){
                            if ( jQuery('#selectRadioFake').val()===null || jQuery('#selectRadioFake').val()===''){
                                jQuery('#selectRadioFake').attr('visited','true');
                            } else {
                                jQuery('#selectRadioFake').attr('visited','false');
                            }
                        })
                    }
                }, 500 );
            } 
        }, 500 );

    }
  
    function resizeChatWindow(count) {
          
        prepareDropDown()

        setTimeout(function() {

            if ( window.outerHeight < 560 ){
                window.resizeTo(334, 560);
                // resizeChatWindow(count+1);
            } else {
                if ( count < 30 ) {
                  resizeChatWindow(count+1);
                }
            }
        }, 1000);
    }
  
    jQuery(document).ready(function() {

        setTimeout(function(){
            jQuery('.header .logo').remove();
            jQuery('.header .title').attr('arial-label', jQuery('.header .title').html());
        }, 1000);
        
        prepareDropDown();

        resizeChatWindow(0);
        
        var dropDownVisted = false;

        jQuery('div').on('DOMNodeInserted', '.container', function() {
            adjustDomForAccessibilty();
            validateEmail();
                        
            if ( hasPreChatDropDown() ) {
                validateDropDown();
            }

            highlightErroringFields();

            focusFirstError();
        });

        jQuery('div').on('DOMNodeInserted', '.message-wrapper', function(e) {
            if ( jQuery('.chat-log-msg').text().startsWith(STR.YOU_ARE_NOW_CHATTING_WITH)===true ){
                jQuery('.message-box').css('opacity', '1');
                jQuery('#message-field').attr( 'aria-label', 'Type your message here');
                jQuery('#message-field').attr( 'placeholder', 'Type your message here');
            }
            if ( jQuery('.chat-error-msg').text().startsWith(STR.agentDisconnected)===true ){
                jQuery('.message-box').css('opacity', '0');   
            }
        });

        var actionsLock = true;

        jQuery('div').on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            jQuery('#message-field').attr( 'aria-label', 'Type your message here');
            jQuery('#message-field').attr( 'placeholder', 'Type your message here');

            //  jQuery('.message-box').css('opacity', '1');
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
    
        jQuery('div').on('DOMNodeInserted', '.message-box', function() {
            const wrapper = document.querySelector('.message-box-item');
  
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
        
        jQuery('a').each( function(i) {
            var title = jQuery(this).attr('title');
            jQuery(this).attr('aria-label', title)
        }) ;

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
            el.addClass('select-error');
        } else {
            el.removeClass('select-error');
            el.attr('visited', 'false');
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
  