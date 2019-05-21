function webchat_init(customParams) {
    const defaultParams = {
        uuid: '',
        tenant: '',
        channel: '',
        stylesheetURL: '',  // should either be absolute starting with 'https:', or path relative to site root starting with '/'
        busPublishInfo: null,
        busPublishLanguage: 'en',   // use 'cy' for Welsh
        domain: 'https://vcc-eu4.8x8.com',
        path: '/.',
        buttonContainerId: 'ctsc-web-chat',
        //linkText: 'Chat online with an agent',
 		busHandlerURL: '',
        additionalText: '',
		additionalTextNoAgent: 'No agents are available, please try again later',
		additionalTextTooBusy: 'All our web chat agents are busy helping other people. Please try again later or contact us using one of the ways below.',
		additionalTextClosed : 'Web chat is now closed.Come back Monday to Friday 9am to 5pm.',
		additionalTextClosed1: 'Or contact us using one of the ways below.',
		linkTextAgent: 'Start web chat (opens in a new window)',
		btnNoAgents: '',
		btnAgentsBusy: '',
		btnServiceClosed: ''
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
        // if stylesheetURL starts with 'https:', just use it as is
            params.stylesheetURL.startsWith('https:') ? params.stylesheetURL :
                // otherwise, if we are running on a https server and stylesheetURL starts with a slash, use it as path
                (params.stylesheetURL.startsWith('/') && location.protocol === 'https') ?
                    'https://' + window.location.hostname + ':' + window.location.port + params.stylesheetURL :
                    // otherwise assume we are running locally for dev or testing, and use master version of CSS from jsdelivr
                    'https://cdn.jsdelivr.net/gh/hmcts/ctsc-web-chat/assets/css/hmcts-webchat.css',
		//busHandlerURL: params.busHandlerURL,			
        //linkText: params.linkText,
        additionalText: params.additionalText,
        onInit: function(bus) {
            window.bus = bus;
		
            const chatContainer = document.querySelector('#' + window.__8x8Chat.buttonContainerId);
            const replaceChatLink = function() {
                const chatImg = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' img');
				const chatLink = document.querySelector('#' + window.__8x8Chat.buttonContainerId + ' a');
				const br = document.createElement('br');
			
                if (chatImg) {
                   const chatImgBtn = chatImg.src.split("CHAT")[1];
				
					if (chatImgBtn == params.btnNoAgents) {
						
						 const additionalText = document.createTextNode(params.additionalTextNoAgent);
						 chatLink.innerHTML = null;
						 chatContainer.appendChild(additionalText);
					
						 
					} else if (chatImgBtn == params.btnAgentsBusy) {
						const additionalText = document.createTextNode(params.additionalTextTooBusy);
						 chatLink.innerHTML = null;
						 chatContainer.appendChild(additionalText); 
					
						 
					} else if (chatImgBtn == params.btnServiceClosed) {
						const additionalText = document.createTextNode(params.additionalTextClosed);
						const additionalText1 = document.createTextNode(params.additionalTextClosed1);
						 chatLink.innerHTML = null;
						 chatContainer.appendChild(additionalText);
						 chatContainer.appendChild(br);
						 chatContainer.appendChild(additionalText1);
						 																								 
									
					} else {
						
					
						const linkText=params.linkTextAgent;
						
						const additionalText = document.createTextNode(params.additionalText);
						
						chatLink.innerHTML = null;
						
						chatLink.innerText = linkText;
					
						chatContainer.appendChild(br);
						
						chatContainer.appendChild(additionalText);			
						
					}	
                }
            };

            // Send optional additional data if passed in
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
    })();
}