# ctsc-web-chat
Node module for CTSC web chat service

### Quick start

```bash
# Add this module as a dependency to your web application using Yarn:
yarn add @hmcts/ctsc-web-chat
```

# Table of Contents

 * [Usage](#usage)
 * [LICENCE](#licence)

## Usage

This node module packages the CSS and javascript required to support the HMCTS CTSC web chat service.  Once the node
module has been added into your own web application, you should ensure that the assets/css and assets/javascript
directories are added to your web server configuration for serving static files.  For example, if using Express:

```javascript
app.use('/webchat', express.static(path.join(__dirname, '/node_modules/@hmcts/ctsc-web-chat/assets')));
```

This allows the CSS to be accessed via `/webchat/css/hmcts-webchat.css` and the javascript to be accessed via
`/webchat/javascript/hmcts-webchat.js`.

In the page where you want the chat link to appear, you need to create an empty div element with id `ctsc-web-chat`:

```html
<div id="ctsc-web-chat"></div>
```

And at the end of the page, include the javascript, and finally call the `webchat_init` function, for example:

```javascript
<script src="/webchat/javascript/hmcts-webchat.js" type="text/javascript"></script>
<script type="text/javascript">
    webchat_init('script_12345678', 'abc123', 'My service',
        location.protocol === 'https' ? window.location.protocol + '//' + window.location.hostname + ':' + window.location.port +
            '/webchat/css/hmcts-webchat.css' : 'https://cdn.jsdelivr.net/gh/hmcts/ctsc-web-chat/assets/css/hmcts-webchat.css');
</script>
```

The webchat_init function takes the following parameters:

|Parameter         |Default                  |Description                                                                                                 |
|------------------|-------------------------|------------------------------------------------------------------------------------------------------------|
|uuid              |n/a                      |UUID value (obtain this from CTSC team)                                                                     |
|tenant            |n/a                      |tenant ID value (obtain this from CTSC team)                                                                |
|channel           |n/a                      |Channel name (obtain this from CTSC team)                                                                   |
|stylesheetURL     |n/a                      |URL of the webchat stylesheet (must be an https URL                                                         |
|busPublishInfo    |n/a                      |Dictionary object of information to be passed to agent e.g. { 'Logged in ID': sLoginId, 'Case ID': sCaseId }|
|busPublishLanguage|en                       |Language to display text in web chat window                                                                 |
|domain            |'https://vcc-eu4.8x8.com'|8x8 domain (this should not need to be changed)                                                             |
|path              |'/.'                     |Path to 8x8 javascript (this should not need to be changed)                                                 |
|buttonContainerId |'ctsc-web-chat'          |The ID of the div element where the link should be rendered                                                 |

## LICENCE

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
