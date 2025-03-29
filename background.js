// Default settings
const defaultSettings = {
  isActive: true,
  autoStart: false,
  translateOnHover: true,
  keyboardShortcutActivation: false,
  hoverDelay: 300,
  targetLanguage: 'en',
  autoDetectLanguage: true,
  sourceLanguages: ['en', 'es', 'fr', 'de', 'zh', 'ru'],
  translationProvider: 'google',
  popupStyle: 'minimal',
  popupPosition: 'cursor',
  fontSize: 'medium',
  showSourceLanguage: true,
  activationKey: 'none',
  useSystemNotifications: false
};

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(Object.keys(defaultSettings), (savedSettings) => {
    // Only set defaults for settings that don't exist yet
    const newSettings = { ...defaultSettings };
    for (const key in savedSettings) {
      if (savedSettings[key] !== undefined) {
        newSettings[key] = savedSettings[key];
      }
    }
    chrome.storage.sync.set(newSettings, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to save initial settings:', chrome.runtime.lastError);
        return;
      }
      
      // Create context menu
      chrome.contextMenus.create({
        id: 'translateSelection',
        title: 'Translate "%s"',
        contexts: ['selection']
      });
      
      // Update extension icon based on active state
      updateIcon(newSettings.isActive);
      
      // Notify all tabs about the initial state
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { 
            action: 'toggleActive', 
            isActive: newSettings.isActive 
          }).catch(() => {
            // Ignore errors for tabs that don't have the content script running
          });
        });
      });
    });
  });
});

// Update extension icon based on active state
function updateIcon(isActive) {
  const iconPath = isActive ? 
    { 
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png" 
    } : 
    { 
      "16": "icons/icon16_disabled.png",
      "48": "icons/icon48_disabled.png",
      "128": "icons/icon128_disabled.png" 
    };
  
  chrome.action.setIcon({ path: iconPath });
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'translate') {
    handleTranslation(message.text, message.sourceLanguage, message.targetLanguage)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep the message channel open for async response
  } 
  else if (message.action === 'getSettings') {
    chrome.storage.sync.get(null, (settings) => {
      sendResponse(settings);
    });
    return true;
  }
  else if (message.action === 'saveSettings') {
    chrome.storage.sync.set(message.settings, () => {
      // Update icon if active state changed
      if (message.settings.isActive !== undefined) {
        updateIcon(message.settings.isActive);
      }
      sendResponse({ success: true });
    });
    return true;
  }
  else if (message.action === 'setActive') {
    chrome.storage.sync.set({ isActive: message.isActive }, () => {
      updateIcon(message.isActive);
      
      // Send message to all tabs to update their active state
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { 
            action: 'toggleActive', 
            isActive: message.isActive 
          }).catch(() => {
            // Ignore errors for tabs that don't have the content script running
          });
        });
      });
      
      sendResponse({ success: true });
      
      // Show notification if enabled
      chrome.storage.sync.get(['useSystemNotifications'], (settings) => {
        if (settings.useSystemNotifications) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'CurSlate',
            message: message.isActive ? 'Translation activated' : 'Translation deactivated'
          });
        }
      });
    });
    return true;
  }
});

// Context menu handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateSelection') {
    chrome.storage.sync.get(['targetLanguage'], (settings) => {
      handleTranslation(info.selectionText, 'auto', settings.targetLanguage)
        .then(result => {
          // Send the translation to the content script to display
          chrome.tabs.sendMessage(tab.id, {
            action: 'showContextMenuTranslation',
            originalText: info.selectionText,
            translatedText: result.translatedText,
            sourceLanguage: result.detectedSourceLanguage || 'auto'
          });
        })
        .catch(error => {
          console.error('Translation error:', error);
        });
    });
  }
});

// Handle browser action click (toolbar icon)
chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.get(['isActive'], (settings) => {
    const newState = !settings.isActive;
    chrome.storage.sync.set({ isActive: newState }, () => {
      updateIcon(newState);
      
      // Send message to all tabs to update their active state
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { 
            action: 'toggleActive', 
            isActive: newState 
          }).catch(() => {
            // Ignore errors for tabs that don't have the content script running
          });
        });
      });
      
      // Show notification if enabled
      chrome.storage.sync.get(['useSystemNotifications'], (settings) => {
        if (settings.useSystemNotifications) {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'CurSlate',
            message: newState ? 'Translation activated' : 'Translation deactivated'
          });
        }
      });
    });
  });
});

const translateText = require('./translate');

// Translation handler function with rate limiting and improved error handling
let lastTranslationTime = 0;
const MIN_TRANSLATION_INTERVAL = 500; // Minimum time between translations in ms

async function handleTranslation(text, sourceLanguage, targetLanguage) {
  if (!text || text.trim() === '') {
    return { error: 'No text to translate' };
  }

  // Rate limiting
  const now = Date.now();
  const timeSinceLastTranslation = now - lastTranslationTime;
  if (timeSinceLastTranslation < MIN_TRANSLATION_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_TRANSLATION_INTERVAL - timeSinceLastTranslation));
  }
  lastTranslationTime = Date.now();
  
  try {
    const result = await translateText(text, {
      from: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
      to: targetLanguage
    });

    // Save translation to history if it was successful
    if (result.translatedText) {
      saveTranslationHistory(
        text,
        result.translatedText,
        result.detectedSourceLanguage,
        targetLanguage
      );
    }

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    return { error: error.message || 'Translation failed' };
  }
}

// Save translation to history
function saveTranslationHistory(originalText, translatedText, sourceLanguage, targetLanguage) {
  // Limit history to last 100 entries
  chrome.storage.local.get(['translationHistory'], (result) => {
    let history = result.translationHistory || [];
    
    // Add new entry at the beginning
    history.unshift({
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the latest 100 entries
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    
    chrome.storage.local.set({ translationHistory: history });
  });
}
