import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import th from "./locales/th.json";
import my from "./locales/my.json";
import km from "./locales/km.json";
import lo from "./locales/lo.json";
import vi from "./locales/vi.json";

// Get saved language from localStorage or default to Thai
const savedLanguage = localStorage.getItem("language") || "th";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
    my: { translation: my },
    km: { translation: km },
    lo: { translation: lo },
    vi: { translation: vi },
  },
  lng: savedLanguage,
  fallbackLng: "th",
  interpolation: { escapeValue: false },
  debug: process.env.NODE_ENV === "development", // Enable debug in development
});

// Save language changes to localStorage
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  console.log("Language changed to:", lng);
});

export default i18n;
