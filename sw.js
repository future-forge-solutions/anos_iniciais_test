const CACHE_NAME = 'aprende-brasil-v1';
const BASE_PATH = '/anos_iniciais_test';
const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/styles.css',
  BASE_PATH + '/fontawesome/css/fontawesome-minimal.css',
  BASE_PATH + '/fontawesome/webfonts/fa-solid-900.woff2',
  BASE_PATH + '/fontawesome/webfonts/fa-brands-400.woff2',
  BASE_PATH + '/images/banner.webp',
  BASE_PATH + '/images/arte.webp',
  BASE_PATH + '/images/ciencias.webp',
  BASE_PATH + '/images/educacaofisica.webp',
  BASE_PATH + '/images/geografia.webp',
  BASE_PATH + '/images/historia.webp',
  BASE_PATH + '/images/linguainglesa.webp',
  BASE_PATH + '/images/liguaportuguesa.webp',
  BASE_PATH + '/images/matematica.webp',
  BASE_PATH + '/images/footer_logo.webp',
  BASE_PATH + '/images/corousel/news1.webp',
  BASE_PATH + '/images/corousel/news2.webp',
  BASE_PATH + '/icons/novedades.svg',
  BASE_PATH + '/js/carousel.js'
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

        // Fetch and cache new requests
        return fetch(event.request).then(function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          var responseToCache = response.clone();

          // Cache static assets
          if (event.request.url.includes('.webp') ||
              event.request.url.includes('.woff2') ||
              event.request.url.includes('.css') ||
              event.request.url.includes('.js') ||
              event.request.url.includes('.svg')) {
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      }
    )
  );
});