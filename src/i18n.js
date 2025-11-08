import { createI18n } from 'vue-i18n';

// Import your message files
import enMessages from '../public/locals/en.json';
import arMessages from '../public/locals/ar.json';

// Get the saved language from localStorage, or set a default
const savedLang = localStorage.getItem('lang') || 'ar'; // Default to Arabic

// Create the i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLang, // Set the active language
  fallbackLocale: 'en', // Fallback language
  messages: {
    en: enMessages,
    ar: arMessages,
  },
});

// Export the instance to be used in main.js
export default i18n;