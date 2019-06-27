(function(root) {
    root.__8x8Chat = {
        onInit: function(bus) {
            bus.publish('chat:set-system-messages', {
                chatEstablishedName: 'You are now chatting with {{agent}}. Please type in the window below to start your chat.',
                pullDownInfo: 'Click for options',
                endChatNotification: 'Chat session has been ended.',
                endChatConfirmation: 'Are you sure you want to end this chat conversation?',
                agentDisconnected: 'This conversation has now ended, please contact us again if you have any further questions.'
            });
        }
    };

    jQuery(document).ready(function() {

        jQuery('div').on('DOMNodeInserted', '.container', function() {
            adjustDomForAccessibilty();
            validateEmail();
            highlightErroringFields();
            focusFirstError();
        });
        
        jQuery('div').on('DOMNodeInserted', '.message-wrapper', function(e) {
            if ( jQuery(".chat-log-msg").text().startsWith("You are now chatting")===true ){
                jQuery(".message-box").css("opacity", "1");
            }
        });

        jQuery('div').on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            jQuery(".message-box").css("opacity", "1");
            jQuery('h1').attr( 'tabindex', '1');
            jQuery('.chat-log-msg').attr( 'tabindex', '0');

            var el = jQuery(e.target);
            console.log(e,el);
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
        jQuery(".actions").children().each(function(){
            jQuery(this).css('display')!=='none'?visibleActoions++:null;
        })
        return (36 * visibleActoions) + "px";
    }

    function optionFlagAccessibility (){

        jQuery(".action-clear").remove();
        jQuery(".actions").hide();
        
        var flagTopPx = getFlagOffsetTop();

        jQuery(".flag").css("top", flagTopPx);  

        jQuery(".flag").css("position", "relative")  ;

        jQuery(".flag").click( function(e) {
            
            jQuery(".actions").toggle();  
            jQuery(".action-clear").remove();

            if ( jQuery(".actions").is(":visible") ) {
                jQuery(".flag").css("top", "0px");    
                jQuery(".actions").children(":visible:first").focus()
            } else {
                jQuery(".flag").css("top", flagTopPx);   
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