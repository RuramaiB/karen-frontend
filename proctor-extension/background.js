// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FORCE_FULLSCREEN") {
    // We update the window associated with the tab that sent the message
    chrome.windows.update(sender.tab.windowId, { state: 'fullscreen' }, (window) => {
      console.log("Window set to fullscreen:", window.id);
      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }
});

// Optional: Monitor window changes to prevent exiting
chrome.windows.onBoundsChanged.addListener((window) => {
  if (window.state !== 'fullscreen') {
      // In a real scenario, we might want to check if this window 
      // contains a proctoring tab before re-forcing.
      console.log("Window exited fullscreen, checking tabs...");
  }
});
