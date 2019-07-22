if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

(function(root) {
    const str = {
        youAreNowChattingWith1: 'You are now chatting with',
        youAreNowChattingWith2: ' {{agent}}. Please type in the window below to start your chat.',
        agentDisconnected: 'This conversation has now ended. Click on the ribbon on the top right if you wish to save a copy of this chat.',
        clickForOptions: 'Click for options',
        chatSessionEnded: 'Chat session has been ended.',
        confirmEndChat: 'Are you sure you want to end this chat conversation?',
        typeMessageHere: 'Type your message here',
        typeHere: 'Type here...',
        yourMessage: 'Your Message: ',
        agent: 'Agent: '
    };
    root.__8x8Chat = {
        onInit: function(bus) {
            bus.publish('chat:set-system-messages', {
                chatEstablishedName: str.youAreNowChattingWith1 + str.youAreNowChattingWith2,
                pullDownInfo: str.clickForOptions,
                endChatNotification: str.chatSessionEnded,
                endChatConfirmation: str.confirmEndChat,
                agentDisconnected: str.agentDisconnected
            });
        }
    };

    jQuery(document).ready(function() {
        const $div = jQuery('div');

        $div.on('DOMNodeInserted', '.container', function() {
            resizeChatWindow();
            adjustDomForAccessibility();
            validateEmail();
            highlightErrors();
        });

        $div.on('DOMNodeInserted', '.message-wrapper', function(e) {
            toggleActions('hide');
            toggleChatFieldOnChatStatus();
            addAriaLabelAndPlaceholderAttributesToChatField();
        });

        $div.on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            toggleActions('show');
            addAriaLabelAttributeToChatMessage(jQuery(e.target));
        });
    });

    function resizeChatWindow() {
        setInterval(function() {
            if (window.outerHeight < 560 || window.outerWidth < 350) {
                window.resizeTo(350, 560);
            }
        }, 1000);
    }

    function adjustDomForAccessibility() {
        removeUnusedContainers('.invitation-container, .offline-container, .skip-queue-container, .post-chat-container');
        removeLogos();
        addAriaLabelAttributeToLinks();
        addAriaLabelAttributeToTitles();
        addAriaLabelAttributeToButtons();
        addAriaLabelAndPlaceholderAttributesToPreChatFields();
    }

    function removeUnusedContainers(containers) {
        const containersArray = document.querySelectorAll(containers);
        for (let i = 0, len = containersArray.length; i < len; i++) {
            containersArray[i].remove();
        }
    }

    function removeLogos() {
        const headerLogoElements = document.querySelectorAll('.header .logo');
        if (headerLogoElements) {
            for (const item of headerLogoElements) {
                item.remove();
            }
        }
    }

    function addAriaLabelAttributeToLinks() {
        const anchorElements = document.querySelectorAll('a');
        if (anchorElements) {
            for (const item of anchorElements) {
                item.setAttribute('aria-label', item.getAttribute('title'));
            }
        }
    }

    function addAriaLabelAttributeToTitles() {
        const headerTitleElements = document.querySelectorAll('.header .title');
        if (headerTitleElements) {
            for (const item of headerTitleElements) {
                item.setAttribute('aria-label', item.textContent);
                item.setAttribute('tabindex', 1);
            }
        }
    }

    function addAriaLabelAttributeToButtons() {
        const buttonElements = document.querySelectorAll('button');
        if (buttonElements) {
            for (const item of buttonElements) {
                item.setAttribute('aria-label', item.textContent);
            }
        }
    }

    function addAriaLabelAndPlaceholderAttributesToPreChatFields() {
        const form = document.querySelector('.pre-chat-container .form-list');
        if (form) {
            const listElements = form.children;
            for (const item of listElements) {
                const label = item.getElementsByTagName('label')[0];
                if (label) {
                    addAttributeToField(item, 'aria-label', label.textContent);
                    addAttributeToField(item, 'placeholder', str.typeHere);
                    wrapLabelInSpan(label);
                }
            }
        }
    }

    function addAttributeToField(wrapper, attribute, value) {
        let field = wrapper.getElementsByTagName('textarea')[0];

        if (!field) {
            field = wrapper.getElementsByTagName('input')[0];
        }

        field.setAttribute(attribute, value);
    }

    function wrapLabelInSpan(label) {
        const newSpan = document.createElement('span');
        const labelNodes = label.childNodes;

        for (const item of labelNodes) {
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

    function highlightErrors() {
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

            focusFirstError();
        }
    }

    function focusFirstError() {
        setTimeout(function() {
            jQuery('textarea.error, input.error').first().focus();
        }, 50);
    }

    function addAriaLabelAttributeToChatMessage(el) {
        jQuery('.chat-log-msg').attr('tabindex', '0');

        el.attr('tabindex', '0');

        let sender;
        if (el.hasClass('chat-incoming-msg')) {
            sender = str.agent;
        } else {
            sender = str.yourMessage;
        }
        let string = el.html();
        string = string.replace(/<span.*?<\/span>/g, '');

        el.attr('aria-label', sender + string);
    }

    function toggleChatFieldOnChatStatus() {
        const messageBoxElement = document.querySelector('.message-box');
        if (jQuery('.chat-log-msg').text().startsWith(str.youAreNowChattingWith1)) {
            jQuery(messageBoxElement).css('opacity', 1);
        }
        if (jQuery('.chat-error-msg').text().startsWith(str.agentDisconnected)) {
            jQuery(messageBoxElement).css('opacity', 0);
        }
    }

    function addAriaLabelAndPlaceholderAttributesToChatField() {
        const messageBoxItemElement = document.querySelector('.message-box-item');
        addAttributeToField(messageBoxItemElement, 'aria-label', str.typeMessageHere);
        addAttributeToField(messageBoxItemElement, 'placeholder', str.typeMessageHere);
    }

    function toggleActions(action) {
        const $actionElement = jQuery('.actions');
        switch(action) {
            case 'hide':
                jQuery('.action-clear').remove();
                if (!jQuery('.chat-log-msg').text().startsWith(str.youAreNowChattingWith1)) {
                    $actionElement.hide();
                }
                break;
            case 'show':
                $actionElement.show();
                break;
        }
    }
})(this);
