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

        jQuery('div').on('DOMNodeInserted', '.message-box', function() {
            const wrapper = document.querySelector('.message-box-item');
            addAriaAtributeToField(wrapper, 'Type your message here');
        });
    });

    function adjustDomForAccessibilty() {
        const form = document.querySelector('.pre-chat-container .form-list');
        if (form) {
            const listItems = form.children;
            for (const item of listItems) {
                const label = item.getElementsByTagName('label')[0];

                if (label) {
                    addAriaAtributeToField(item, label.textContent);
                    wrapLabelInSpan(label);
                }
            }
        }
    }

    function addAriaAtributeToField(item, label) {
        let field = item.getElementsByTagName('textarea')[0];

        if (!field) {
            field = item.getElementsByTagName('input')[0];
        }

        field.setAttribute('aria-label', label);
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
