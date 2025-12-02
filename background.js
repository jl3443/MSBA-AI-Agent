// UCLA MSBA AI Agent - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
    console.log('🎓 UCLA MSBA AI Agent installed');
});

// Handle commands
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-msba-assistant') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'TOGGLE_SIDEBAR'
                });
            }
        });
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_SETTINGS') {
        chrome.storage.sync.get(['msbaApiKey', 'msbaModel'], (result) => {
            sendResponse(result);
        });
        return true; // Keep channel open for async response
    }
});

