const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'dist/styles.css',
    '/index.js',
    'images/icon-192x192.png',
    'images/icon-512x512.png'
];

// Установите кэш
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Открыт кэш');
            return cache.addAll(urlsToCache);
        })
    );
});

// Очистка старого кэша (если нужно)
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Если ресурс найден в кэше, верните его
            if (response) {
                return response;
            }
            // В противном случае выполните сетевой запрос
            return fetch(event.request);
        })
    );
});