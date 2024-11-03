import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/public/components/theme-provider";
import { Toaster } from "@/common/components/ui/sonner";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import es from "../i18n/Español/es.json";
import en from "../i18n/Ingles/en.json";
import { LanguageProvider } from "./public/components/LanguageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

i18next.use(initReactI18next).init({
  lng: "es",
  fallbackLng: "es",
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

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              expand={true}
              richColors
              toastOptions={{
                classNames: {
                  error: "bg-red-400",
                  success: "text-green-400",
                  warning: "text-yellow-400",
                  info: "bg-blue-400",
                },
              }}
            />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
