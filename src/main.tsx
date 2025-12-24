import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SalonProvider } from "@/contexts/SalonContext";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

const renderApp = () => {
  createRoot(rootEl).render(
    <SalonProvider>
      <App />
    </SalonProvider>
  );
};

async function cleanupDevServiceWorkerAndCaches() {
  if (!("serviceWorker" in navigator)) return;

  const hadController = !!navigator.serviceWorker.controller;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
  } catch {
    // ignore
  }

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // ignore
  }

  // If a SW was controlling the page, reload once to ensure fresh React bundle.
  if (hadController && !sessionStorage.getItem("lacouronne_sw_dev_reloaded")) {
    sessionStorage.setItem("lacouronne_sw_dev_reloaded", "1");
    window.location.reload();
    return;
  }
}

// Always render the app immediately - no conditional dev mode checks
renderApp();

// Register service worker in production
if (!import.meta.env.DEV && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.log("SW registration failed:", err));
  });
}
