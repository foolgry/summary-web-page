

chrome.action.onClicked.addListener((tab) => {
    getCurrentTab((tab) => {
          chrome.sidePanel.setOptions({
            tabId: tab.id,
            entabled: true,
        });
    });
});

function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
      console.error(chrome.runtime.lastError);
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      callback(tab);
    });
  }


