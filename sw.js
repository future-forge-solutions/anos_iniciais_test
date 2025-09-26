const CACHE_NAME = 'aprende-brasil-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/fontawesome/css/fontawesome-minimal.css',
  '/fontawesome/webfonts/fa-solid-900.woff2',
  '/fontawesome/webfonts/fa-brands-400.woff2',
  '/images/banner.webp',
  '/images/arte.webp',
  '/images/ciencias.webp',
  '/images/educacaofisica.webp',
  '/images/geografia.webp',
  '/images/historia.webp',
  '/images/linguainglesa.webp',
  '/images/liguaportuguesa.webp',
  '/images/matematica.webp',
  '/images/footer_logo.webp',
  '/images/corousel/news1.webp',
  '/images/corousel/news2.webp',
  '/icons/novedades.svg',
  '/js/carousel.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});