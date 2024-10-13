import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/public/components/theme-provider";
import { Toaster } from "@/common/components/ui/sonner";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../i18n/Español/es.json"
import en from "../i18n/Ingles/en.json"
import { LanguageProvider } from "./public/components/LanguageProvider";

i18next.use(initReactI18next).init({
  lng: "es",
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    es: {
      translation: es,
    },
    en: {
      translation: en,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <LanguageProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" expand={true} richColors />
      </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
