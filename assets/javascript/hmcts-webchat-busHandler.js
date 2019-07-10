(function(root) {
    const STR = {
        YOU_ARE_NOW_CHATTING_WITH: 'You are now chatting with ',
        agentDisconnected: 'This conversation has now ended. Click on the ribbon on the top right if you wish to save a copy of this chat.',
    };
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

    function resizeChatWindow(count) {

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

        resizeChatWindow(0);


        jQuery('div').on('DOMNodeInserted', '.container', function() {
            adjustDomForAccessibilty();
            validateEmail();

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

        let actionsLock = true;

        jQuery('div').on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            jQuery('#message-field').attr( 'aria-label', 'Type your message here');
            jQuery('#message-field').attr( 'placeholder', 'Type your message here');

            //  jQuery('.message-box').css('opacity', '1');
            jQuery('h1').attr( 'tabindex', '1');
            jQuery('.chat-log-msg').attr( 'tabindex', '0');

            const el = jQuery(e.target);
            el.attr('tabindex', '0');
            let pref = 'Your Message: '
            if ( el.hasClass('chat-incoming-msg') ) {
                pref = 'Agent ';
            }
            let str = el.html();
            str = str.replace( /<.*?>/g, '  '  );

            el.attr('aria-label', pref + str);
        });

        jQuery('div').on('DOMNodeInserted', '.message-box', function() {

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
        });
        return (36 * visibleActoions) + 'px';
    }

    function optionFlagAccessibility (){

        jQuery('.action-clear').remove();
        jQuery('.actions').hide();

        const flagTopPx = getFlagOffsetTop();

        jQuery('.flag').css('top', flagTopPx);

        jQuery('.flag').css('position', 'relative')  ;

        jQuery('.flag').click( function() {

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

        jQuery('a').each( function() {
            const title = jQuery(this).attr('title');
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
        const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function highlightErroringFields() {
        const errorImages = document.querySelectorAll('.pre-chat-container .error-image');

        if (errorImages) {
            for (const item of errorImages) {
                const field = jQuery(item).parent.siblings('textarea, input')[0];

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
