const CACHE_NAME = "kubera-warhunt-v5pro-final-v2";   // ← Changed version so old cache is ignored

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest'
  // icons will be cached automatically
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();   // Force new service worker to activate immediately
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 🔥 BETTER FETCH STRATEGY (Network-first for development)
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // For main files → always try network first (so your updates appear immediately)
  if (url.includes('index.html') || 
      url.includes('app.js') || 
      url.includes('styles.css') ||
      url.includes('manifest.webmanifest')) {
    
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // For everything else → cache-first (fast & offline friendly)
  e.respondWith(
    caches.match(e.request).then(response => 
      response || fetch(e.request)
    )
  );
});
