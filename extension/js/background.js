var salr_client = false;

/**
 * Event listener for when a user enters their username within
 * the extension UI.  Currently this only works when you're
 * viewing forums.somethingawful.com since we don't have any
 * events that can be fired on a localStorage event that occurs
 * within the extension.
 *
 */
var port = createPort();

// Set up the listener for when we request our settings.
port.onMessage.addListener(function init(data) {
  salr_client = new SALR(data, chrome.extension.getURL("images/"));
  port.onMessage.removeListener(init);
});

// Request the settings from the extension.
port.postMessage({'message': 'GetPageSettings'});

// Create a port to communicate through.
function createPort() {
    let p = chrome.runtime.connect();

    // If we disconnect, clear our port variable so we know the reconnect the port when we next send a message.
    // Chromium browsers keep the port open for a while, but Firefox can very quickly close the port.
    p.onDisconnect.addListener(() => {
        port = null;
        p = null;
    });

    return p;
}

// Gateway method for components to post to the extension.
function postMessage(message_object) {
    if (port === null) {
        port = createPort();
    }

    port.postMessage(message_object);
}
