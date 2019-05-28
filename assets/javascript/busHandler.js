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
})(this);
