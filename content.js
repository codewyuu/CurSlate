// Global variables
let isActive = true;
let hoverDelay = 300;
let targetLanguage = 'en';
let autoDetectLanguage = true;
let sourceLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ru'];
let popupStyle = 'minimal';
let popupPosition = 'cursor';
let fontSize = 'medium';
let showSourceLanguage = true;
let translateOnHover = true;
let keyboardShortcutActivation = false;
let activationKey = 'none';
let hoverTimer = null;
let popup = null;
let lastTargetElement = null;

// Create popup when content script loads
document.addEventListener('DOMContentLoaded', () => {
  createPopup();
});

// Load settings when content script starts
chrome.storage.sync.get([
  'isActive',
  'hoverDelay',
  'targetLanguage',
  'autoDetectLanguage',
  'sourceLanguages',
  'popupStyle',
  'popupPosition',
  'fontSize',
  'showSourceLanguage',
  'translateOnHover',
  'keyboardShortcutActivation',
  'activationKey'
], (settings) => {
  if (settings.isActive !== undefined) isActive = settings.isActive;
  if (settings.hoverDelay !== undefined) hoverDelay = settings.hoverDelay;
  if (settings.targetLanguage !== undefined) targetLanguage = settings.targetLanguage;
  if (settings.autoDetectLanguage !== undefined) autoDetectLanguage = settings.autoDetectLanguage;
  if (settings.sourceLanguages !== undefined) sourceLanguages = settings.sourceLanguages;
  if (settings.popupStyle !== undefined) popupStyle = settings.popupStyle;
  if (settings.popupPosition !== undefined) popupPosition = settings.popupPosition;
  if (settings.fontSize !== undefined) fontSize = settings.fontSize;
  if (settings.showSourceLanguage !== undefined) showSourceLanguage = settings.showSourceLanguage;
  if (settings.translateOnHover !== undefined) translateOnHover = settings.translateOnHover;
  if (settings.keyboardShortcutActivation !== undefined) keyboardShortcutActivation = settings.keyboardShortcutActivation;
  if (settings.activationKey !== undefined) activationKey = settings.activationKey;
});

// Listen for changes in settings
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    for (let key in changes) {
      switch (key) {
        case 'isActive':
          isActive = changes[key].newValue;
          break;
        case 'hoverDelay':
          hoverDelay = changes[key].newValue;
          break;
        case 'targetLanguage':
          targetLanguage = changes[key].newValue;
          break;
        case 'autoDetectLanguage':
          autoDetectLanguage = changes[key].newValue;
          break;
        case 'sourceLanguages':
          sourceLanguages = changes[key].newValue;
          break;
        case 'popupStyle':
          popupStyle = changes[key].newValue;
          if (popup) updatePopupStyle();
          break;
        case 'popupPosition':
          popupPosition = changes[key].newValue;
          break;
        case 'fontSize':
          fontSize = changes[key].newValue;
          if (popup) updatePopupStyle();
          break;
        case 'showSourceLanguage':
          showSourceLanguage = changes[key].newValue;
          break;
        case 'translateOnHover':
          translateOnHover = changes[key].newValue;
          break;
        case 'keyboardShortcutActivation':
          keyboardShortcutActivation = changes[key].newValue;
          break;
        case 'activationKey':
          activationKey = changes[key].newValue;
          break;
      }
    }
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleActive') {
    isActive = message.isActive;
    if (!isActive && popup) {
      hidePopup();
    }
    sendResponse({ success: true });
  }
  return true;
});

// Create translation popup
function createPopup() {
  if (popup) return;
  popup = document.createElement('div');
  popup.className = 'curslate-popup';
  popup.style.display = 'none';
  popup.style.position = 'fixed';
  popup.style.zIndex = '2147483647';
  popup.style.maxWidth = '300px';
  popup.style.padding = '8px 12px';
  popup.style.borderRadius = '4px';
  popup.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  popup.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
  popup.style.opacity = '0';
  popup.style.backgroundColor = '#FFFFFF';
  popup.style.border = '1px solid #E5E7EB';
  updatePopupStyle();
  
  // Create header for source/target language (shown if showSourceLanguage is true)
  const header = document.createElement('div');
  header.className = 'curslate-popup-header';
  header.style.fontSize = '0.75rem';
  header.style.marginBottom = '0.25rem';
  popup.appendChild(header);
  
  // Create content for translated text
  const content = document.createElement('div');
  content.className = 'curslate-popup-content';
  popup.appendChild(content);
  
  // Ensure popup is appended to document body
  if (document.body) {
    document.body.appendChild(popup);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(popup);
    });
  }
}

// Update popup style based on settings
function updatePopupStyle() {
  if (!popup) return;
  
  // Set font size
  switch (fontSize) {
    case 'small':
      popup.style.fontSize = '0.75rem';
      break;
    case 'medium':
      popup.style.fontSize = '0.875rem';
      break;
    case 'large':
      popup.style.fontSize = '1rem';
      break;
  }
  
  // Set popup style
  switch (popupStyle) {
    case 'minimal':
      popup.style.backgroundColor = '#FFFFFF';
      popup.style.color = '#1F2937';
      popup.style.border = '1px solid #E5E7EB';
      popup.style.padding = '0.5rem 0.75rem';
      popup.querySelector('.curslate-popup-header').style.color = '#6B7280';
      break;
    case 'detailed':
      popup.style.backgroundColor = '#FFFFFF';
      popup.style.color = '#1F2937';
      popup.style.border = '1px solid #E5E7EB';
      popup.style.padding = '0.75rem 1rem';
      popup.querySelector('.curslate-popup-header').style.color = '#6B7280';
      break;
    case 'dark':
      popup.style.backgroundColor = '#1F2937';
      popup.style.color = '#F9FAFB';
      popup.style.border = '1px solid #374151';
      popup.style.padding = '0.5rem 0.75rem';
      popup.querySelector('.curslate-popup-header').style.color = '#9CA3AF';
      break;
  }
}

// Position the popup based on settings and cursor position
function positionPopup(x, y) {
  if (!popup) return;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popupRect = popup.getBoundingClientRect();
  const popupWidth = popupRect.width || 300;
  const popupHeight = popupRect.height || 100;
  
  let posX, posY;
  
  // Calculate position based on popup position setting
  switch (popupPosition) {
    case 'cursor':
      posX = x;
      posY = y + 10; // Add small offset from cursor
      break;
    case 'fixed':
      posX = viewportWidth / 2;
      posY = viewportHeight / 2;
      break;
    default:
      posX = x;
      posY = y + 10;
  }
  
  // Adjust position to keep popup within viewport
  if (posX + popupWidth > viewportWidth) {
    posX = viewportWidth - popupWidth - 10;
  }
  if (posY + popupHeight > viewportHeight) {
    posY = y - popupHeight - 10;
  }
  
  // Ensure popup doesn't go off-screen
  posX = Math.max(10, Math.min(viewportWidth - popupWidth - 10, posX));
  posY = Math.max(10, Math.min(viewportHeight - popupHeight - 10, posY));
  
  switch (popupPosition) {
    case 'cursor':
      posX = x + 10;
      posY = y + 10;
      break;
    case 'above':
      posX = x;
      posY = y - 10;
      popup.style.transform = 'translateY(-100%)';
      break;
    case 'below':
      posX = x;
      posY = y + 20;
      popup.style.transform = 'translateY(0)';
      break;
    case 'fixed':
      posX = window.innerWidth - 320;
      posY = window.innerHeight - 100;
      break;
  }
  
  // Use the existing popupRect instead of creating a new one
  if (posX + popupRect.width > window.innerWidth) {
    posX = window.innerWidth - popupRect.width - 10;
  }
  
  if (posY + popupRect.height > window.innerHeight) {
    posY = window.innerHeight - popupRect.height - 10;
  }
  
  // Final viewport boundary checks
  if (posX + popupWidth > window.innerWidth) {
    posX = window.innerWidth - popupWidth - 10;
  }
  
  if (posY + popupHeight > window.innerHeight) {
    posY = window.innerHeight - popupHeight - 10;
  }
  
  popup.style.left = `${posX}px`;
  popup.style.top = `${posY}px`;
}

// Show popup with translation
function showPopup(originalText, translatedText, sourceLanguage, posX, posY) {
  if (!popup) {
    createPopup();
  }
  
  // Set content
  const header = popup.querySelector('.curslate-popup-header');
  const content = popup.querySelector('.curslate-popup-content');
  
  if (showSourceLanguage) {
    header.textContent = `${getLanguageName(sourceLanguage)} → ${getLanguageName(targetLanguage)}`;
    header.style.display = 'block';
  } else {
    header.style.display = 'none';
  }
  
  content.textContent = translatedText;
  
  // Show popup with animation
  popup.style.display = 'block';
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0)';
  });
  
  // Position and show popup
  popup.style.display = 'block';
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const x = rect.left + (rect.width / 2);
  const y = rect.bottom + window.scrollY;
  positionPopup(x, y);
  popup.style.opacity = '1';
  popup.style.transform = 'translateY(0)';
}

// Hide popup
function hidePopup() {
  if (popup) {
    popup.style.opacity = '0';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 200);
  }
}

// Get text from element
function getTextFromElement(element) {
  // Skip inputs, text areas, and other form elements
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    return '';
  }
  
  // Get text content from specific selected text or element
  let text = '';
  const selection = window.getSelection();
  
  if (selection && selection.toString().trim()) {
    text = selection.toString().trim();
  } else {
    // Try to get direct text content first
    if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      text = element.textContent.trim();
    } else {
      // Get text from child text nodes only
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      const textParts = [];
      
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
          textParts.push(node.nodeValue.trim());
        }
      }
      
      text = textParts.join(' ').trim();
    }
  }
  
  return text;
}

// Detect language (simple version - a more robust implementation would use a proper language detection library)
function detectLanguage(text) {
  // Cyrillic characters - Russian
  if (/[а-яА-Я]/.test(text)) return "ru";
  
  // Chinese characters
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  
  // Japanese characters
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  
  // German characters
  if (/[äöüßÄÖÜ]/.test(text)) return "de";
  
  // French characters
  if (/[àâçéèêëîïôùûüÿæœÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ]/.test(text)) return "fr";
  
  // Spanish characters
  if (/[áéíóúüñÁÉÍÓÚÜÑ]/.test(text)) return "es";
  
  // Default to English
  return "en";
}

// Get language name from code
function getLanguageName(code) {
  const languages = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    auto: "Auto-detected"
  };
  
  return languages[code] || code;
}

// Check if the modifier key is pressed
function isModifierKeyPressed(event) {
  if (!keyboardShortcutActivation || activationKey === 'none') {
    return true;
  }
  
  switch (activationKey) {
    case 'alt':
      return event.altKey;
    case 'ctrl':
      return event.ctrlKey;
    case 'shift':
      return event.shiftKey;
    default:
      return true;
  }
}

// Translate text
function translateText(text, sourceLanguage) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'translate',
      text: text,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    }, (response) => {
      if (response && response.translatedText) {
        resolve(response);
      } else {
        reject(new Error(response?.error || 'Translation failed'));
      }
    });
  });
}

// Mouse move handler
function handleMouseMove(event) {
  if (!isActive || !translateOnHover || !isModifierKeyPressed(event)) {
    if (popup && popup.style.display !== 'none') {
      hidePopup();
    }
    return;
  }

  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (!text) {
    if (popup && popup.style.display !== 'none') {
      hidePopup();
    }
    return;
  }

  const sourceLanguage = autoDetectLanguage ? detectLanguage(text) : 'auto';
  if (!autoDetectLanguage && !sourceLanguages.includes(sourceLanguage)) {
    return;
  }

  if (hoverTimer) {
    clearTimeout(hoverTimer);
  }

  hoverTimer = setTimeout(() => {
    translateText(text, sourceLanguage)
      .then(result => {
        if (result.translatedText) {
          showTranslation(text, result.translatedText, result.detectedSourceLanguage || sourceLanguage);
        }
      })
      .catch(error => {
        console.error('Translation error:', error);
      });
  }, hoverDelay);
  
  const target = event.target;
  
  // Skip translation popup itself
  if (popup && (target === popup || popup.contains(target))) {
    return;
  }
  
  // Skip if element is the same as last target
  if (target === lastTargetElement) {
    return;
  }
  
  lastTargetElement = target;
  
  hoverTimer = setTimeout(async () => {
    const text = getTextFromElement(target);
    
    if (text && text.length > 1) {
      // Detect language or use selected source language
      let sourceLanguage = 'auto';
      if (!autoDetectLanguage && sourceLanguages.length > 0) {
        sourceLanguage = sourceLanguages[0];
      } else if (autoDetectLanguage) {
        sourceLanguage = detectLanguage(text);
      }
      
      // Don't translate if text is already in target language
      if (sourceLanguage === targetLanguage) {
        return;
      }
      
      try {
        const result = await translateText(text, sourceLanguage);
        showPopup(text, result.translatedText, result.detectedSourceLanguage || sourceLanguage, event.clientX, event.clientY);
      } catch (error) {
        console.error('Translation error:', error);
      }
    } else if (popup && popup.style.display !== 'none') {
      hidePopup();
    }
  }, hoverDelay);
}

// Mouse out handler
function handleMouseOut() {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
}

// Add event listeners for text selection and hover
document.addEventListener('mousemove', handleMouseMove);

// Add event listener for text selection
document.addEventListener('mouseup', () => {
  if (!isActive || !isModifierKeyPressed(event)) return;
  
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (!text) return;
  
  const sourceLanguage = autoDetectLanguage ? detectLanguage(text) : 'auto';
  if (!autoDetectLanguage && !sourceLanguages.includes(sourceLanguage)) return;
  
  translateText(text, sourceLanguage)
    .then(result => {
      if (result.translatedText) {
        showTranslation(text, result.translatedText, result.detectedSourceLanguage || sourceLanguage);
      }
    })
    .catch(error => {
      console.error('Translation error:', error);
    });
});

// Keyboard shortcut listener
document.addEventListener('keydown', (event) => {
  // Ctrl+Shift+T to toggle translation
  if (event.ctrlKey && event.shiftKey && event.key === 'T') {
    isActive = !isActive;
    chrome.runtime.sendMessage({ action: 'setActive', isActive });
    
    if (!isActive && popup) {
      hidePopup();
    }
  }
  
  // Copy translation shortcut (Ctrl+C when popup is visible)
  if (event.ctrlKey && event.key === 'c' && popup && popup.style.display !== 'none') {
    const translatedText = popup.querySelector('.curslate-popup-content').textContent;
    navigator.clipboard.writeText(translatedText)
      .then(() => {
        // Show copy confirmation
        const originalText = popup.querySelector('.curslate-popup-content').textContent;
        popup.querySelector('.curslate-popup-content').textContent = 'Copied to clipboard!';
        
        setTimeout(() => {
          popup.querySelector('.curslate-popup-content').textContent = originalText;
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
});

// Context menu translation
document.addEventListener('contextmenu', (event) => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    // Store selected text and position for the context menu handler
    sessionStorage.setItem('curslateSelectedText', selection);
    sessionStorage.setItem('curslatePositionX', event.clientX);
    sessionStorage.setItem('curslatePositionY', event.clientY);
  }
});
