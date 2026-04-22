document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load the current API key if it exists
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save the API key
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
        statusDiv.textContent = 'API key saved successfully!';
        statusDiv.style.color = 'green';
        setTimeout(() => {
          statusDiv.textContent = '';
        }, 3000);
      });
    } else {
      chrome.storage.local.remove(['geminiApiKey'], () => {
        statusDiv.textContent = 'Custom API key cleared. Using default key.';
        statusDiv.style.color = 'green';
        setTimeout(() => {
          statusDiv.textContent = '';
        }, 3000);
      });
    }
  });
});