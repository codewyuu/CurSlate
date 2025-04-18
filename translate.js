// ARML Translation Service Implementation

const MAX_TEXT_LENGTH = 5000;
const CACHE_EXPIRY = 1800000; // 30 minutes in milliseconds

// Cache for storing translations
const translationCache = new Map();

// Normalize language codes to ARML format
function normalizeLanguageCode(code) {
  const languageMap = {
    'zh-CN': 'zh',
    'zh-TW': 'zh-TW',
    'auto': 'auto'
  };
  return languageMap[code] || code;
}

// Validate input parameters
function validateInput(text, options) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input: Text must be a non-empty string');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
  }

  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options: Options must be an object');
  }

  if (!options.to) {
    throw new Error('Target language must be specified in options');
  }
}

// Generate cache key
function getCacheKey(text, options) {
  const from = options.from || 'auto';
  const to = options.to;
  return `${from}:${to}:${text}`;
}

// Check if cache entry is valid
function isCacheValid(entry) {
  return entry && (Date.now() - entry.timestamp) < CACHE_EXPIRY;
}

// Get language name
function getLanguageName(code) {
  try {
    return ISO6391.getName(code) || code;
  } catch (error) {
    return code;
  }
}

// Handle translation errors
function handleError(error, text) {
  const errorMessage = error.message || 'Unknown error occurred';
  console.error('Translation error:', {
    error: errorMessage,
    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
    timestamp: new Date().toISOString()
  });

  if (error.code === 'BAD_NETWORK') {
    return new Error('Network error: Please check your internet connection');
  } else if (error.code === 'BAD_REQUEST') {
    return new Error('Invalid request: Please check your input');
  } else if (error.code === 'RATE_LIMIT') {
    return new Error('Rate limit exceeded: Please try again later');
  }

  return new Error(`Translation failed: ${errorMessage}`);
}

// Main translation function
async function translateText(text, options = {}) {
  try {
    validateInput(text, options);

    const normalizedOptions = {
      ...options,
      from: normalizeLanguageCode(options.from || 'auto'),
      to: normalizeLanguageCode(options.to)
    };

    const cacheKey = getCacheKey(text, normalizedOptions);
    const cachedResult = translationCache.get(cacheKey);

    if (isCacheValid(cachedResult)) {
      return cachedResult.result;
    }

    // Custom ARML client implementation
    const response = await fetch('https://api.arml.trymagic.xyz/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text,
        from: normalizedOptions.from === 'auto' ? 'auto' : normalizedOptions.from,
        to: normalizedOptions.to
      })
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    const result = {
      translatedText: data.translation,
      detectedSourceLanguage: data.detected_language || normalizedOptions.from,
      sourceLanguageName: getLanguageName(data.detected_language || normalizedOptions.from),
      targetLanguageName: getLanguageName(normalizedOptions.to),
      confidence: data.confidence || 1,
      alternativeTranslations: data.alternatives || [],
      originalText: text
    };

    translationCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    throw handleError(error, text);
  }
}

module.exports = {
  translateText,
  normalizeLanguageCode,
  getLanguageName,
  MAX_TEXT_LENGTH,
  CACHE_EXPIRY
};