// Development cache management utilities
export const devCache = {
  // Clear all caches
  clearAllCaches: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  },

  // Clear specific cache by name
  clearCache: async (cacheName: string) => {
    if ('caches' in window) {
      await caches.delete(cacheName);
      console.log(`Cache "${cacheName}" cleared`);
    }
  },

  // List all caches
  listCaches: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('Available caches:', cacheNames);
      return cacheNames;
    }
    return [];
  },

  // Unregister service worker
  unregisterSW: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service worker unregistered');
      }
    }
  },

  // Force service worker update
  forceUpdate: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service worker update triggered');
      }
    }
  },

  // Development mode cache management
  devMode: {
    // Enable aggressive cache clearing in development
    enableDevMode: () => {
      if (import.meta.env.DEV) {
        // Clear caches on page load in development
        window.addEventListener('load', () => {
          setTimeout(() => {
            devCache.clearAllCaches();
          }, 1000);
        });

        // Add to window for console access
        (window as any).devCache = devCache;
        console.log('Development cache management enabled. Use window.devCache for manual control.');
      }
    },

    // Disable dev mode
    disableDevMode: () => {
      if (import.meta.env.DEV) {
        delete (window as any).devCache;
        console.log('Development cache management disabled');
      }
    }
  }
};

// Auto-enable dev mode in development
if (import.meta.env.DEV) {
  devCache.devMode.enableDevMode();
} 