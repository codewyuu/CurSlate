document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Set initial active tab
  const initialActiveTab = tabs[0];
  const initialTabName = initialActiveTab.getAttribute('data-tab');
  initialActiveTab.classList.add('active');
  document.getElementById(initialTabName).classList.add('active');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and tab contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      const tabContent = document.getElementById(tabName);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
  
  // Form elements
  const isActiveToggle = document.getElementById('is-active');
  const autoStartToggle = document.getElementById('auto-start');
  const translateOnHoverToggle = document.getElementById('translate-on-hover');
  const keyboardShortcutActivationToggle = document.getElementById('keyboard-shortcut-activation');
  const hoverDelayRange = document.getElementById('hover-delay-range');
  const hoverDelayValue = document.getElementById('hover-delay-value');
  const targetLanguageSelect = document.getElementById('target-language');
  const autoDetectLanguageToggle = document.getElementById('auto-detect-language');
  const translationProviderSelect = document.getElementById('translation-provider');
  const popupPositionSelect = document.getElementById('popup-position');
  const showSourceLanguageToggle = document.getElementById('show-source-language');
  const useSystemNotificationsToggle = document.getElementById('use-system-notifications');
  const saveHistoryToggle = document.getElementById('save-history');
  const activationKeySelect = document.getElementById('activation-key');
  
  // Style options
  const styleOptions = document.querySelectorAll('.style-option');
  let selectedStyle = 'minimal';
  
  styleOptions.forEach(option => {
    option.addEventListener('click', () => {
      styleOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      selectedStyle = option.getAttribute('data-style');
    });
  });
  
  // Font size options
  const fontOptions = document.querySelectorAll('.font-option');
  let selectedFontSize = 'medium';
  
  fontOptions.forEach(option => {
    option.addEventListener('click', () => {
      fontOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      selectedFontSize = option.getAttribute('data-size');
    });
  });
  
  // Update hover delay display
  hoverDelayRange.addEventListener('input', () => {
    hoverDelayValue.textContent = `${hoverDelayRange.value}ms`;
  });
  
  // Load settings
  function loadSettings() {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
      // General settings
      isActiveToggle.checked = settings.isActive;
      autoStartToggle.checked = settings.autoStart;
      translateOnHoverToggle.checked = settings.translateOnHover;
      keyboardShortcutActivationToggle.checked = settings.keyboardShortcutActivation;
      hoverDelayRange.value = settings.hoverDelay;
      hoverDelayValue.textContent = `${settings.hoverDelay}ms`;
      
      // Language settings
      targetLanguageSelect.value = settings.targetLanguage;
      autoDetectLanguageToggle.checked = settings.autoDetectLanguage;
      
      // Source languages
      const sourceLanguages = typeof settings.sourceLanguages === 'string' 
        ? settings.sourceLanguages.split(',') 
        : settings.sourceLanguages;
        
      document.querySelectorAll('[id^="lang-"]').forEach(checkbox => {
        const langCode = checkbox.id.replace('lang-', '');
        checkbox.checked = sourceLanguages.includes(langCode);
      });
      
      translationProviderSelect.value = settings.translationProvider;
      
      // Appearance settings
      styleOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-style') === settings.popupStyle) {
          option.classList.add('selected');
          selectedStyle = settings.popupStyle;
        }
      });
      
      popupPositionSelect.value = settings.popupPosition;
      
      fontOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-size') === settings.fontSize) {
          option.classList.add('selected');
          selectedFontSize = settings.fontSize;
        }
      });
      
      showSourceLanguageToggle.checked = settings.showSourceLanguage;
      
      // Shortcut settings
      activationKeySelect.value = settings.activationKey;
      useSystemNotificationsToggle.checked = settings.useSystemNotifications;
      
      // Load translation history
      loadTranslationHistory();
    });
  }
  
  // Load translation history
  function loadTranslationHistory() {
    chrome.storage.local.get(['translationHistory'], (result) => {
      const historyList = document.getElementById('history-list');
      historyList.innerHTML = '';
      
      const history = result.translationHistory || [];
      
      if (history.length === 0) {
        historyList.innerHTML = '<div class="history-item">No translation history yet.</div>';
        return;
      }
      
      history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const languages = document.createElement('div');
        languages.className = 'history-languages';
        languages.textContent = `${item.sourceLanguage} → ${item.targetLanguage}`;
        
        const original = document.createElement('div');
        original.className = 'history-original';
        original.textContent = item.originalText;
        
        const translation = document.createElement('div');
        translation.className = 'history-translation';
        translation.textContent = item.translatedText;
        
        const time = document.createElement('div');
        time.className = 'history-time';
        time.textContent = formatTime(new Date(item.timestamp));
        
        historyItem.appendChild(languages);
        historyItem.appendChild(original);
        historyItem.appendChild(translation);
        historyItem.appendChild(time);
        
        historyList.appendChild(historyItem);
      });
    });
  }
  
  // Format timestamp
  function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
  
  // Save settings
  function saveSettings() {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Get source languages from checkboxes
    const sourceLanguages = [];
    document.querySelectorAll('[id^="lang-"]').forEach(checkbox => {
      if (checkbox.checked) {
        sourceLanguages.push(checkbox.id.replace('lang-', ''));
      }
    });
    
    const settings = {
      isActive: isActiveToggle.checked,
      autoStart: autoStartToggle.checked,
      translateOnHover: translateOnHoverToggle.checked,
      keyboardShortcutActivation: keyboardShortcutActivationToggle.checked,
      hoverDelay: parseInt(hoverDelayRange.value),
      targetLanguage: targetLanguageSelect.value,
      autoDetectLanguage: autoDetectLanguageToggle.checked,
      sourceLanguages: sourceLanguages,
      translationProvider: translationProviderSelect.value,
      popupStyle: selectedStyle,
      popupPosition: popupPositionSelect.value,
      fontSize: selectedFontSize,
      showSourceLanguage: showSourceLanguageToggle.checked,
      activationKey: activationKeySelect.value,
      useSystemNotifications: useSystemNotificationsToggle.checked,
      saveHistory: saveHistoryToggle.checked
    };
    
    // First save to chrome.storage.sync
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to save settings:', chrome.runtime.lastError);
        saveBtn.textContent = 'Error Saving!';
        saveBtn.disabled = false;
        setTimeout(() => {
          saveBtn.textContent = 'Save Settings';
        }, 2000);
        return;
      }

      // Then notify background script
      chrome.runtime.sendMessage({ action: 'saveSettings', settings }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          console.error('Failed to notify background script:', chrome.runtime.lastError || 'Invalid response');
          saveBtn.textContent = 'Error Saving!';
        } else {
          saveBtn.textContent = 'Saved!';
        }
        
        saveBtn.disabled = false;
        setTimeout(() => {
          saveBtn.textContent = 'Save Settings';
        }, 1500);
      });
    });
  } // Removed extra closing brace here

  // Reset settings to defaults
  function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      chrome.runtime.sendMessage({ action: 'getSettings', defaults: true }, (settings) => {
        // General settings
        isActiveToggle.checked = settings.isActive;
        autoStartToggle.checked = settings.autoStart;
        translateOnHoverToggle.checked = settings.translateOnHover;
        keyboardShortcutActivationToggle.checked = settings.keyboardShortcutActivation;
        hoverDelayRange.value = settings.hoverDelay;
        hoverDelayValue.textContent = `${settings.hoverDelay}ms`;
        
        // Language settings
        targetLanguageSelect.value = settings.targetLanguage;
        autoDetectLanguageToggle.checked = settings.autoDetectLanguage;
        
        document.querySelectorAll('[id^="lang-"]').forEach(checkbox => {
          const langCode = checkbox.id.replace('lang-', '');
          checkbox.checked = settings.sourceLanguages.includes(langCode);
        });
        
        translationProviderSelect.value = settings.translationProvider;
        
        // Appearance settings
        styleOptions.forEach(option => {
          option.classList.remove('selected');
          if (option.getAttribute('data-style') === settings.popupStyle) {
            option.classList.add('selected');
            selectedStyle = settings.popupStyle;
          }
        });
        
        popupPositionSelect.value = settings.popupPosition;
        
        fontOptions.forEach(option => {
          option.classList.remove('selected');
          if (option.getAttribute('data-size') === settings.fontSize) {
            option.classList.add('selected');
            selectedFontSize = settings.fontSize;
          }
        });
        
        showSourceLanguageToggle.checked = settings.showSourceLanguage;
        
        // Shortcut settings
        activationKeySelect.value = settings.activationKey;
        useSystemNotificationsToggle.checked = settings.useSystemNotifications;
        
        // Save the reset settings
        saveSettings();
      });
    }
  }
  
  // Clear translation history
  function clearHistory() {
    if (confirm('Are you sure you want to clear your translation history?')) {
      chrome.storage.local.set({ translationHistory: [] }, () => {
        loadTranslationHistory();
      });
    }
  }
  
  // Event listeners
  document.getElementById('save-btn').addEventListener('click', saveSettings);
  document.getElementById('reset-btn').addEventListener('click', resetSettings);
  document.getElementById('clear-history').addEventListener('click', clearHistory);
  
  // Load initial settings
  loadSettings();
});
