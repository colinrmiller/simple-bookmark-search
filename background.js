chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_popup') {
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 400,
        height: 300
      });
    }
  });
  