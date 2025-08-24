const CACHE_NAME = 'lakhi-cache-v1';
const OFFLINE_URL = 'offline.html';

const FILES_TO_CACHE = [
  'https://shop.lakhiairconditioners.com/offline.html',
  'https://shop.lakhiairconditioners.com/styles.css',
  'https://shop.lakhiairconditioners.com/game.js',
  'https://shop.lakhiairconditioners.comimg/1x1-logo.png',
  'https://shop.lakhiairconditioners.com/img/NABR/log.jpg',
  'https://shop.lakhiairconditioners.com/img/NABR/SCI.png',
  'https://shop.lakhiairconditioners.com/img/NABR/menu.png',
  'https://shop.lakhiairconditioners.com/img/log-w.png',
  'https://shop.lakhiairconditioners.com/DOWNLOADED CSS/fontawesome-free-6.7.2-web/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install event: cache all required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve cached content or offline page
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});