import { createI18n } from "vue-i18n";

// ✅ Import the translation files (Vite will bundle them correctly for Netlify)
import en from "../public/locals/en.json";
import ar from "../public/locals/ar.json";
console.log("✅ EN:", en);
console.log("✅ AR:", ar);

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
console.log("🌐 i18n initialized with locale:", savedLang);
export default i18n;
