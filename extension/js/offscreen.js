(async () => {
  const settings = {};
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    settings[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
  }
  const port = chrome.runtime.connect();
  port.postMessage({
    message: 'ConvertSettings',
    settings,
  });
})()
  .catch((err) => {
    console.error(err);
  });
