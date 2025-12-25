import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SalonProvider } from "@/contexts/SalonContext";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

// Render app immediately - no delays
const root = createRoot(rootEl);
root.render(
  <SalonProvider>
    <App />
  </SalonProvider>
);

// Clear stale service worker caches on every load to prevent blank screens
async function clearStaleServiceWorkerCaches() {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      console.log("[App] Cleared all caches for fresh load");
    }
  } catch {
    // Silently ignore - not critical
  }
}

// In development, unregister service workers to prevent caching issues
if (import.meta.env.DEV) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }
  clearStaleServiceWorkerCaches();
}

// Register service worker in production only
if (!import.meta.env.DEV && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Clear old caches first
    clearStaleServiceWorkerCaches().then(() => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
          // Force update check
          reg.update();
        })
        .catch((err) => console.log("SW registration failed:", err));
    });
  });
}
