document.addEventListener('DOMContentLoaded', function() {
  const translationToggle = document.getElementById('translation-toggle');
  const targetLanguageSelect = document.getElementById('target-language');
  const hoverDelaySelect = document.getElementById('hover-delay');
  const optionsBtn = document.getElementById('options-btn');
  const saveBtn = document.getElementById('save-btn');
  
  // Load settings
  chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
    // Populate form with current settings
    translationToggle.checked = settings.isActive;
    targetLanguageSelect.value = settings.targetLanguage;
    hoverDelaySelect.value = settings.hoverDelay.toString();
  });
  
  // Toggle translation on/off
  translationToggle.addEventListener('change', () => {
    const isActive = translationToggle.checked;
    chrome.runtime.sendMessage({ action: 'setActive', isActive });
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const settings = {
      isActive: translationToggle.checked,
      targetLanguage: targetLanguageSelect.value,
      hoverDelay: parseInt(hoverDelaySelect.value)
    };
    
    // Notify background script first
    chrome.runtime.sendMessage({ action: 'saveSettings', settings }, (response) => {
      if (!response || !response.success) {
        console.error('Failed to save settings in background');
        saveBtn.textContent = 'Error!';
        saveBtn.disabled = false;
        setTimeout(() => {
          saveBtn.textContent = 'Save';
        }, 2000);
        return;
      }
      
      // Then save to chrome.storage.sync
      chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to save settings:', chrome.runtime.lastError);
          saveBtn.textContent = 'Error!';
          saveBtn.disabled = false;
          setTimeout(() => {
            saveBtn.textContent = 'Save';
          }, 2000);
          return;
        }

        // Both operations successful
        saveBtn.textContent = 'Saved!';
        setTimeout(() => {
          window.close();
        }, 500);
      });
    });

    // Add a timeout to handle cases where background script doesn't respond
    setTimeout(() => {
      if (saveBtn.textContent === 'Saving...') {
        saveBtn.textContent = 'Error!';
        saveBtn.disabled = false;
        setTimeout(() => {
          saveBtn.textContent = 'Save';
        }, 2000);
      }
    }, 5000);
  }); // Save button click handler end
  
  // Open options page
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}); // DOMContentLoaded end
