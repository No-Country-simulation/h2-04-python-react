import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/public/components/theme-provider";
import { Toaster } from "@/common/components/ui/sonner";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <App />
        <Toaster position="top-right" expand={true} richColors />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
