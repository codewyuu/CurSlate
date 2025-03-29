// Language codes mapping for special cases
const LANGUAGE_CODES = {
  'zh-CN': 'zh',
  'zh-TW': 'zh-TW',
  'auto': 'auto'
};

// Cache for storing recent translations
const translationCache = new Map();
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

// Maximum text length for translation
const MAX_TEXT_LENGTH = 5000;

// Google Translate API endpoint
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Normalizes language code to be compatible with the translation API
 * @param {string} langCode - The language code to normalize
 * @returns {string} - Normalized language code
 */
function normalizeLanguageCode(langCode) {
  return LANGUAGE_CODES[langCode] || langCode;
}

/**
 * Validates the input text and options for translation
 * @param {string} text - Text to translate
 * @param {Object} options - Translation options
 * @throws {Error} - If validation fails
 */
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

/**
 * Generates a cache key for the translation
 * @param {string} text - Text to translate
 * @param {Object} options - Translation options
 * @returns {string} - Cache key
 */
function generateCacheKey(text, options) {
  const from = options.from || 'auto';
  const to = options.to;
  return `${from}:${to}:${text}`;
}

/**
 * Checks if a cached translation is still valid
 * @param {Object} cachedResult - Cached translation result
 * @returns {boolean} - Whether the cache is valid
 */
function isCacheValid(cachedResult) {
  if (!cachedResult) return false;
  return Date.now() - cachedResult.timestamp < CACHE_EXPIRY;
}

/**
 * Gets language name from ISO code
 * @param {string} langCode - ISO language code
 * @returns {string} - Language name
 */
function getLanguageName(langCode) {
  try {
    return ISO6391.getName(langCode) || langCode;
  } catch (error) {
    return langCode;
  }
}

/**
 * Handles translation errors
 * @param {Error} error - The error object
 * @param {string} text - Original text
 * @returns {Error} - Enhanced error object
 */
function handleTranslationError(error, text) {
  const errorMessage = error.message || 'Unknown error occurred';
  console.error('Translation error:', {
    error: errorMessage,
    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
    timestamp: new Date().toISOString()
  });

  if (error.code === 'BAD_NETWORK') {
    return new Error('Network error: Please check your internet connection');
  }
  if (error.code === 'BAD_REQUEST') {
    return new Error('Invalid request: Please check your input');
  }
  if (error.code === 'RATE_LIMIT') {
    return new Error('Rate limit exceeded: Please try again later');
  }

  return new Error(`Translation failed: ${errorMessage}`);
}

/**
 * Main translation function
 * @param {string} text - Text to translate
 * @param {Object} options - Translation options
 * @returns {Promise<Object>} - Translation result
 */
async function translateText(text, options = {}) {
  try {
    // Input validation
    validateInput(text, options);

    // Normalize language codes
    const normalizedOptions = {
      ...options,
      from: normalizeLanguageCode(options.from || 'auto'),
      to: normalizeLanguageCode(options.to)
    };

    // Check cache
    const cacheKey = generateCacheKey(text, normalizedOptions);
    const cachedResult = translationCache.get(cacheKey);
    if (isCacheValid(cachedResult)) {
      return cachedResult.result;
    }

    // Prepare API request
    const params = new URLSearchParams({
      q: text,
      target: normalizedOptions.to,
      source: normalizedOptions.from !== 'auto' ? normalizedOptions.from : undefined
    });

    // Make API request
    const response = await fetch(`${TRANSLATE_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Process result
    const translationResult = {
      translatedText: data.data.translations[0].translatedText,
      detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage || normalizedOptions.from,
      sourceLanguageName: getLanguageName(data.data.translations[0].detectedSourceLanguage || normalizedOptions.from),
      targetLanguageName: getLanguageName(normalizedOptions.to),
      confidence: 1,
      alternativeTranslations: [],
      originalText: text
    };

    // Cache result
    translationCache.set(cacheKey, {
      result: translationResult,
      timestamp: Date.now()
    });

    return translationResult;
  } catch (error) {
    throw handleTranslationError(error, text);
  }
}

// Export functions
module.exports = {
  translateText,
  normalizeLanguageCode,
  getLanguageName,
  MAX_TEXT_LENGTH,
  CACHE_EXPIRY
};