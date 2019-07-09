(function(root) {
    let countPrepareDropDown = 0;
    let STR = {
        YOU_ARE_NOW_CHATTING_WITH: 'You are now chatting with {{agent}}. Please type in the window below to start your chat.',
        AGENT_DISCONNECTED: 'This conversation has now ended. Click on the ribbon on the top right if you wish to save a copy of this chat.',
        TYPE_YOUR_MESSAGE_HERE: 'Type your message here',
        CLICK_FOR_OPTIONS: 'Click for options',
        CHAT_ENDED: 'Chat session has been ended.',
        CHAT_CONFIRM_CLOSE: 'Are you sure you want to end this chat conversation?'
    };

    root.__8x8Chat = {
        onInit: function(bus) {
            bus.publish('chat:set-system-messages', {
                chatEstablishedName: STR.YOU_ARE_NOW_CHATTING_WITH,
                pullDownInfo: STR.CLICK_FOR_OPTIONS,
                endChatNotification: STR.CHAT_ENDED,
                endChatConfirmation: STR.CHAT_CONFIRM_CLOSE,
                agentDisconnected: STR.AGENT_DISCONNECTED
            });
        }
    };

    function stripHtml(s){
      return s.replace(/(<([^>]+)>)/ig,'');
    }

    function makeDropDown(options, ids) {
        if (typeof options === 'undefined' || options.length < 2) {
            return;
        }
        if (jQuery('#selectRadioFake').length > 0) {
            return;
        }

        let s = '<label>' + options[0] + '</label>';
        s += '<select aria-label="' + options[0] + '" id="selectRadioFake" onchange="jQuery(\'#\' + this.value).click()" >' + '<option disabled selected value=""></option>';
        for (let i = 0; i < ids.length; ++i) {
            let val = stripHtml(options[i+1]);
            s += '<option value="'+ ids[i] +'">' + val + '</option>';
        }
        s += '</select>';
        return s;
    }

    function hasPreChatDropDown() {
        return jQuery('[data-identifier=droplist-radio-q1]').length > 0;
    }

    function fakeHide($element) {
        if ($element.length > 0) {
            $element
                .css('overflow', 'hidden')
                .css('height', '0px')
                .css('opacity', '0')
                .css('position', 'absolute')
                .css('top', '-1000px');
        }
    }

    function prepareDropDown() {
        if (countPrepareDropDown < 10 && !hasPreChatDropDown()) {
            countPrepareDropDown++;
            setTimeout(function(){
                prepareDropDown();
            }, 250 );
            return;
        }
        const $dropdownLi = jQuery('[data-identifier=droplist-radio-q1]:first').parent();

        fakeHide($dropdownLi);

        setTimeout(function() {
            fakeHide($dropdownLi);

            var optionList = [];
            var idList = [];

            $dropdownLi.children('label').each(function() {
                optionList.push(stripHtml(jQuery(this).html()));
            });

            jQuery('[data-identifier=droplist-radio-q1]').each(function() {
                idList.push(jQuery(this).attr('id'));
            });

            if (idList.length > 0) {
                let drop = makeDropDown(optionList, idList);
                $dropdownLi.after(drop);
                setTimeout(function() {
                    const fakeRadio = jQuery('#selectRadioFake');
                    if (fakeRadio.length>0 ){
                        fakeRadio.focus();
                        fakeRadio.blur(function() {
                            if (fakeRadio.val() === null || fakeRadio.val() === '') {
                                fakeRadio.attr('visited', 'true');
                            } else {
                                fakeRadio.attr('visited', 'false');
                            }
                        })
                    }
                }, 500);
            }
        }, 500);
    }

    function resizeChatWindow(count) {
        prepareDropDown();

        setTimeout(function() {
            if (window.outerHeight < 560) {
                window.resizeTo(334, 560);
                // resizeChatWindow(count+1);
            } else {
                if (count < 30) {
                    resizeChatWindow(count+1);
                }
            }
        }, 1000);
    }

    function getFlagOffsetTop() {
        var visibleActions = 0;
        jQuery('.actions').children().each(function() {
            jQuery(this).css('display') !== 'none' ? visibleActions++ : null;
        });
        return (36 * visibleActions) + 'px';
    }

    function optionFlagAccessibility () {
        const $flag = jQuery('.flag');
        const $actions = jQuery('.actions');

        jQuery('.action-clear').remove();
        $actions.hide();

        const flagTopPx = getFlagOffsetTop();

        $flag
            .css('top', flagTopPx)
            .css('position', 'relative')
            .click(function() {
                $actions.toggle();
                jQuery('.action-clear').remove();

                if ($actions.is(':visible') ) {
                    $flag.css('top', '0px');
                    $actions.children(':visible:first').focus();
                } else {
                    $flag.css('top', flagTopPx);
                }
            });
    }

    function adjustDomForAccessibilty() {
        jQuery('a').each(function() {
            let title = jQuery(this).attr('title');
            jQuery(this).attr('aria-label', title);
        });

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

        field.setAttribute(attribute, value);
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
        if (el.val() === null || el.val() === '') {
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
        const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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

    jQuery(document).ready(function() {
        const div = jQuery('div');
        let actionsLock = true;

        setTimeout(function() {
            const $headerTitle = jQuery('.header .title');
            jQuery('.header .logo').remove();
            $headerTitle.attr('arial-label', $headerTitle.html());
        }, 1000);

        prepareDropDown();

        resizeChatWindow(0);

        div.on('DOMNodeInserted', '.container', function() {
            adjustDomForAccessibilty();
            validateEmail();

            if (hasPreChatDropDown()) {
                validateDropDown();
            }

            highlightErroringFields();

            focusFirstError();
        });

        div.on('DOMNodeInserted', '.message-wrapper', function() {
            if (jQuery('.chat-log-msg').text().startsWith(STR.YOU_ARE_NOW_CHATTING_WITH)){
                jQuery('.message-box').css('opacity', '1');
                jQuery('#message-field')
                    .attr('aria-label', STR.TYPE_YOUR_MESSAGE_HERE)
                    .attr('placeholder', STR.TYPE_YOUR_MESSAGE_HERE);
            }
            if (jQuery('.chat-error-msg').text().startsWith(STR.AGENT_DISCONNECTED)){
                jQuery('.message-box').css('opacity', '0');
            }
        });

        div.on('DOMNodeInserted', '.chat-incoming-msg, .chat-outgoing-msg', function(e) {
            jQuery('#message-field')
                .attr('aria-label', STR.TYPE_YOUR_MESSAGE_HERE)
                .attr('placeholder', STR.TYPE_YOUR_MESSAGE_HERE);

            //  jQuery('.message-box').css('opacity', '1');
            jQuery('h1').attr( 'tabindex', '1');
            jQuery('.chat-log-msg').attr( 'tabindex', '0');

            let el = jQuery(e.target);
            el.attr('tabindex', '0');

            let pref = 'Your Message: ';
            if (el.hasClass('chat-incoming-msg')) {
                pref = 'Agent ';
            }

            let str = el.html();
            str = str.replace( /<.*?>/g, '  ');

            el.attr('aria-label', pref + str);
        });

        div.on('DOMNodeInserted', '.message-box', function() {
            const wrapper = document.querySelector('.message-box-item');

            if (actionsLock) {
                optionFlagAccessibility();
            }

            actionsLock = false;
        });
    });
})(this);
