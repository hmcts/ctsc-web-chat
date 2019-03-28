function webchat_init(uuid, tenant, channel, stylesheetURL, busPublishInfo, busPublishLanguage='en', domain = 'https://vcc-eu4.8x8.com', path = '/.', buttonContainerId = 'ctsc-web-chat') {
    window.__8x8Chat = {
        uuid: uuid,
        tenant: tenant,
        channel: channel,
        domain: domain,
        path: path,
        buttonContainerId: buttonContainerId,
        align: 'right',
        stylesheetURL: stylesheetURL,
        linkText: 'Chat online with an agent',
        additionalText: '(Monday to Friday, 9.00am to 5.00pm)',
        onInit: function(bus) {
            window.bus = bus;

            const chatContainer = document.querySelector('#' + window.__8x8Chat.buttonContainerId);
            const replaceChatLink = function() {
                const chatImg = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' img');

                if (chatImg) {
                    const chatLink = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' a');
                    const br = document.createElement('br');
                    const additionalText = document.createTextNode(window.__8x8Chat.additionalText);

                    chatLink.innerHTML = null;
                    chatLink.innerText = window.__8x8Chat.linkText;

                    chatContainer.appendChild(br);
                    chatContainer.appendChild(additionalText);
                }
            };

            // Send optional additional data if passed in
            if (busPublishInfo) {
                bus.publish('customer:set-info', busPublishInfo);
            }
            bus.publish('chat:set-language', busPublishLanguage);

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
    })();
}
