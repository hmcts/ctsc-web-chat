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

```html
<script src="/webchat/javascript/hmcts-webchat.js"></script>
<script nonce="{{ nonce }}">
    webchat_init({
        uuid: 'script_12345678',
        tenant: 'abc123',
        channel: 'My service',
        stylesheetURL: '/webchat/css/hmcts-webchat.css'
    });
</script>
```

The webchat_init function takes a dictionary consisting of the following parameters:

|Parameter         |Default                               |Description                                                                                                                                                                                                                                                                                                                                               |
|------------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|uuid              |n/a                                   |UUID value (obtain this from CTSC team)                                                                                                                                                                                                                                                                                                                   |
|tenant            |n/a                                   |tenant ID value (obtain this from CTSC team)                                                                                                                                                                                                                                                                                                              |
|channel           |n/a                                   |Channel name (obtain this from CTSC team)                                                                                                                                                                                                                                                                                                                 |
|stylesheetURL     |n/a                                   |URL of the webchat stylesheet (from this node module). This should either be absolute and starting 'https:', or a path relative to root. The CSS must be served over CSS; if it isn't (for instance running locally for development), a URL pointing to the github master CSS mirrored in jsdelivr (to deliver the correct MIME type) will be used instead|
|busPublishInfo    |n/a                                   |Optional dictionary object of information to be passed to agent e.g. { 'Logged in ID': sLoginId, 'Case ID': sCaseId }                                                                                                                                                                                                                                     |
|busPublishLanguage|'en'                                  |Language to display text in web chat window. 'en' is English, 'cy' is Welsh.                                                                                                                                                                                                                                                                              |
|domain            |'https://vcc-eu4.8x8.com'             |8x8 domain (this should not need to be changed)                                                                                                                                                                                                                                                                                                           |
|path              |'/.'                                  |Path to 8x8 javascript (this should not need to be changed)                                                                                                                                                                                                                                                                                               |
|buttonContainerId |'ctsc-web-chat'                       |The ID of the div element where the link should be rendered                                                                                                                                                                                                                                                                                               |
|linkText          |'Chat online with an agent',          |The text to be displayed in the link that activates the web chat                                                                                                                                                                                                                                                                                          |
|additionalText    |'(Monday to Friday, 9.00am to 5.00pm)'|Additional text to be displayed under the link that activates the web chat                                                                                                                                                                                                                                                                                |

## LICENCE

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
