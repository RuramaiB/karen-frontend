// popup.js
document.getElementById('forceBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
            chrome.runtime.sendMessage({ type: "FORCE_FULLSCREEN" }, (response) => {
                const status = document.getElementById('status');
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 2000);
            });
        }
    });
});
