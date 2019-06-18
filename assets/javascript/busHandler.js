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
        jQuery('div').on('DOMNodeInserted', '.form-list', function() {
            const errorImages = jQuery('.pre-chat-container .error-image');
            const form = jQuery('.pre-chat-container .form-list')[0];
            const listItems = jQuery(form).find('li');

            jQuery.each(listItems, function(index, item) {
                const newSpan = document.createElement('span');
                const label = item.getElementsByTagName('label')[0];

                if (label) {
                    const labelNodes = label.childNodes;

                    for (let i=0; i<labelNodes.length; i++) {
                        if (labelNodes[i].nodeType === Node.TEXT_NODE) {
                            newSpan.appendChild(document.createTextNode(labelNodes[i].nodeValue));
                            label.replaceChild(newSpan, labelNodes[i]);
                        }
                    }
                }
            });

            const emailField = jQuery('input[data-essential="email_id"]');
            if (emailField.val() !== '' && !isValidEmail(emailField.val())) {
                emailField.siblings('label').children('.error-image').css('display', 'inline-block');
            } else {
                emailField.siblings('label').children('.error-image').css('display', 'none');
            }

            jQuery.each(errorImages, function(index, item) {
                const field = jQuery(item).parent().siblings('textarea, input')[0];

                if (item.style.display === 'inline-block') {
                    jQuery(field).addClass('error');
                } else {
                    jQuery(field).removeClass('error');
                }
            });

            setTimeout(function() {
                jQuery('textarea.error, input.error').first().focus();
            }, 50);
        });
    });

    function isValidEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
})(this);
