// UCLA MSBA AI Assistant - Popup Settings

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('model');
    const saveBtn = document.getElementById('saveBtn');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    loadSettings();

    // Save button click event
    saveBtn.addEventListener('click', saveSettings);

    // API key input validation
    apiKeyInput.addEventListener('input', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            validateApiKey(apiKey);
        }
    });

    // Load settings
    function loadSettings() {
        chrome.storage.sync.get(['msbaApiKey', 'msbaModel'], function(result) {
            if (result.msbaApiKey) {
                apiKeyInput.value = result.msbaApiKey;
            }
            if (result.msbaModel) {
                modelSelect.value = result.msbaModel;
            }
        });
    }

    // Save settings
    function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;

        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }

        // Validate API key format
        if (!apiKey.startsWith('sk-')) {
            showStatus('API key format incorrect. Should start with "sk-"', 'error');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        // Validate API key
        validateApiKey(apiKey).then(isValid => {
            if (isValid) {
                // Save to Chrome storage
                chrome.storage.sync.set({
                    msbaApiKey: apiKey,
                    msbaModel: model
                }, function() {
                    showStatus('Settings saved successfully!', 'success');
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save Settings';

                    // Notify content script
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        if (tabs[0]) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                type: 'SETTINGS_UPDATED',
                                apiKey: apiKey,
                                model: model
                            }).catch(err => {
                                console.log('Extension not loaded on current page:', err);
                            });
                        }
                    });
                });
            } else {
                showStatus('API key validation failed. Please check your key.', 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Settings';
            }
        });
    }

    // Validate API key
    async function validateApiKey(apiKey) {
        try {
            // Try DeepSeek API first
            const response = await fetch('https://api.deepseek.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) return true;

            // Try OpenAI API
            const openaiResponse = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return openaiResponse.ok;
        } catch (error) {
            console.error('API key validation failed:', error);
            return false;
        }
    }

    // Show status message
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
});

