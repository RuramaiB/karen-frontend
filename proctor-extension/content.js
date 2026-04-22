// content.js

function requestFullscreen() {
  console.log("Sending fullscreen request to background script...");
  chrome.runtime.sendMessage({ type: "FORCE_FULLSCREEN" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("Fullscreen request handled:", response);
    }
  });
}

// 1. Detect by URL heuristic (localhost:3000 cases)
const isExamPage = () => {
    return window.location.href.includes('exam') || 
           window.location.href.includes('proctor') ||
           document.title.toLowerCase().includes('exam');
};

// 2. Listen for custom events from the web page itself
// The Nuxt app can dispatch this event to trigger the extension
window.addEventListener("PROCTOR_FORCE_FULLSCREEN", () => {
    console.log("Custom event PROCTOR_FORCE_FULLSCREEN detected!");
    requestFullscreen();
});

// Initialization
console.log("Proctor Extension: Content script initialized.");

// If we are on an exam page already (e.g. page refresh)
if (isExamPage()) {
    console.log("Exam page detected via URL. Requesting fullscreen...");
    requestFullscreen();
}

// Monitor fullscreen exits
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && isExamPage()) {
    console.warn("Fullscreen exited on an exam page! Re-enforcing in 1s...");
    setTimeout(requestFullscreen, 1000);
  }
});
