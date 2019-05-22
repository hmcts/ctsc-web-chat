 // external-bus-handler.js
(function(root) {
    root.__8x8Chat = {
        onInit: function(bus) {
            // system message localization goes here
            // change end message
            bus.publish("chat:set-system-messages", {
                // Localized/Customized messages goes here
                chatEstablishedName: "You are now chatting with {{agent}}. Please type in the grey window below to start your chat",
                pullDownInfo: "Click for options",
                endChatNotification: "Chat session has been ended.  Please provide feedback at https://www.google.com",
                endChatConfirmation: "Are you sure you want to end this chat conversation? Please provide feedback via this survey https://survey.com/1234",
                agentDisconnected: "This conversation has now ended, please contact us again if you have any further questions"
             });
          }
      };
  })(this);
