// Custom service worker registration for better development experience
export function registerSW() {
  if ('serviceWorker' in navigator) {
    // Clear existing caches in development
    if (import.meta.env.DEV) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Register the service worker
    navigator.serviceWorker
      .register('/dev-sw.js?dev-sw', { 
        scope: '/', 
        type: 'classic' 
      })
      .then(registration => {
        console.log('SW registered: ', registration);

        // Handle updates in development
        if (import.meta.env.DEV) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, reload the page
                  window.location.reload();
                }
              });
            }
          });
        }
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });

    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
}

// Function to unregister service worker (useful for development)
export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
} 