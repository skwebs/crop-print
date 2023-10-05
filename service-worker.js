const cacheName = 'my-pwa-cache-v1';
const cacheUrls = [
    './',
    './index.html',
    './manifest.json',
    "./vendors/cropper/1.6.0/cropper.min.css",
    "./vendors/cropper/1.6.0/cropper.min.js",
    "./style.css",
    "./main.js",
    "./pwa.js",
    "./service-worker.js",
    "./192x192.svg",
    "./select_picture.png",
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(cacheUrls);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
