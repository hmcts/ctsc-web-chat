function parseText(text) {
    return text.split('\n');
}

function webchat_init(customParams) {
    const version = '0.1.23';

    const defaultParams = {
        uuid: '',
        tenant: '',
        channel: '',
        stylesheetURL: '', // should either be absolute starting with 'https:', or path relative to site root starting with '/'
        busPublishInfo: null,
        busPublishLanguage: 'en', // use 'cy' for Welsh
        domain: 'https://vcc-eu4.8x8.com',
        path: '/.',
        buttonContainerId: 'ctsc-web-chat',
        busHandlerURL: '',
        chatDownAction: 'showMessage', // use 'showMessage' or 'hideHeader'
        chatDownText: 'The web chat service is temporarily unavailable, please try again later.',
        additionalText: '',
        additionalTextNoAgent: 'No agents are available, please try again later.',
        additionalTextTooBusy: 'All our web chat agents are busy helping other people. Please try again later or contact us using one of the ways below.',
        additionalTextClosed : 'The web chat is now closed. Come back Monday to Friday 9:30am to 5pm.\nOr contact us using one of the ways below.',
        additionalTextChatAlreadyOpen: 'A web chat window is already open.',
        linkTextAgent: 'Start web chat (opens in a new window)',
        chatLinkFocusable: true,
        btnNoAgents: '/aG1jdHNzdGFnaW5nMDE/button_7732814745cac6f4603c4d1.53357933/img/logo',
        btnAgentsBusy: '/aG1jdHNzdGFnaW5nMDE/button_2042157415cc19c95669039.65793052/img/logo',
        btnServiceClosed: '/aG1jdHNzdGFnaW5nMDE/button_20199488815cc1a89e0861d5.73103009/img/logo'
    };

    let params = Object.assign({}, defaultParams, customParams);

    window.__8x8Chat = {
        uuid: params.uuid,
        tenant: params.tenant,
        channel: params.channel,
        domain: params.domain,
        path: params.path,
        buttonContainerId: params.buttonContainerId,
        align: 'right',
        stylesheetURL:
            params.stylesheetURL.startsWith('https:') ? params.stylesheetURL :
                (params.stylesheetURL.startsWith('/') && location.protocol === 'https') ?
                    'https://' + window.location.hostname + ':' + window.location.port + params.stylesheetURL :
                    'https://cdn.jsdelivr.net/npm/@hmcts/ctsc-web-chat@' + version + '/assets/css/hmcts-webchat.min.css',
        busHandlerURL: params.busHandlerURL,
        chatDownAction: params.chatDownAction,
        chatDownText: params.chatDownText,
        additionalText: params.additionalText,
        chatLinkFocusable: params.chatLinkFocusable,
        onInit: function(bus) {
            window.bus = bus;

            const chatContainer = document.querySelector('#' + window.__8x8Chat.buttonContainerId);
            const replaceChatLink = function() {
                const chatImg = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' img');
                const chatLink = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' a');

                if (chatLink && !window.__8x8Chat.chatLinkFocusable) {
                    chatLink.setAttribute('tabindex', '-1');
                }

                if (chatImg) {
                    const chatImgBtn = chatImg.src.split('CHAT')[1];
                    const paragraph = document.createElement('p');
                    let additionalTextArray;

                    chatLink.innerHTML = null;

                    if (chatImgBtn === params.btnNoAgents) {
                        additionalTextArray = parseText(params.additionalTextNoAgent);
                    } else if (chatImgBtn === params.btnAgentsBusy) {
                        additionalTextArray = parseText(params.additionalTextTooBusy);
                    } else if (chatImgBtn === params.btnServiceClosed) {
                        additionalTextArray = parseText(params.additionalTextClosed);
                    } else {
                        const chatLinkParagraph = document.createElement('p');
                        chatLink.innerText = params.linkTextAgent;
                        chatLink.parentNode.insertBefore(chatLinkParagraph, chatLink);
                        chatLinkParagraph.appendChild(chatLink);
                        additionalTextArray = parseText(params.additionalText);
                    }

                    additionalTextArray.forEach((line, index) => {
                        const br = document.createElement('br');
                        const additionalTextLine = document.createTextNode(line);
                        paragraph.appendChild(additionalTextLine);
                        if (index < additionalTextArray.length - 1) {
                            paragraph.appendChild(br);
                        }
                    });

                    chatContainer.appendChild(paragraph);
                }
            };

            if (params.busPublishInfo) {
                bus.publish('customer:set-info', params.busPublishInfo);
            }
            bus.publish('chat:set-language', params.busPublishLanguage);

            if (chatContainer) {
                replaceChatLink();

                const mutationObserver = new MutationObserver(replaceChatLink);
                mutationObserver.observe(chatContainer, {
                    childList: true
                });
            }
        }
    };

    (function() {
        const se = document.createElement('script');
        se.type = 'text/javascript';
        se.async = true;
        se.src = window.__8x8Chat.domain + window.__8x8Chat.path + '/CHAT/common/js/chat.js';

        const os = document.getElementsByTagName('script')[0];
        os.parentNode.insertBefore(se, os);

        setTimeout(function() {
            const chatContainer = document.querySelector('#' + window.__8x8Chat.buttonContainerId);

            if (chatContainer.innerHTML === '') {
                switch (window.__8x8Chat.chatDownAction) {
                    case 'showMessage':
                        chatContainer.innerHTML = window.__8x8Chat.chatDownText;
                        break;
                    case 'hideHeader':
                        const chatHeader = document.querySelector('#' + window.__8x8Chat.buttonContainerId + '-header');
                        chatHeader.parentNode.removeChild(chatHeader);
                        break;
                }
            }
        }, 2000);
    })();
}
