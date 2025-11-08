import { createI18n } from "vue-i18n";

// ✅ Import the translation files (Vite will bundle them correctly for Netlify)
import en from "./locals/en.json";
import ar from "./locals/ar.json";

// ✅ Safe language retrieval
let savedLang = "ar"; // Default language
try {
  const stored = localStorage.getItem("lang");
  if (stored) savedLang = stored;
} catch (error) {
  console.warn("LocalStorage not accessible:", error);
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true, // Allows $t() in templates directly
  locale: savedLang,
  fallbackLocale: "en",
  messages: {
    en,
    ar,
  },
});

export default i18n;
