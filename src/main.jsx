import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster />
  </>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./serviceworker.js")
      .then((registration) => {
        console.log(`
          RRRRR  
          R    R 
          RRRRR  
          R   R  
          R    Ranjan
          `);          
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
