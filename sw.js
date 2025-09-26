const CACHE_NAME = 'aprende-brasil-v4'; // Fuentes locales
const BASE_PATH = '/anos_iniciais_test';
const urlsToCache = [
  // Recursos principales
  BASE_PATH + '/',
  BASE_PATH + '/styles.css',
  BASE_PATH + '/js/carousel.js',
  BASE_PATH + '/icons/novedades.svg',

  // Font Awesome
  BASE_PATH + '/fontawesome/css/fontawesome-minimal.css',
  BASE_PATH + '/fontawesome/webfonts/fa-solid-900.woff2',
  BASE_PATH + '/fontawesome/webfonts/fa-brands-400.woff2',


  

  // Imágenes desktop
  BASE_PATH + '/images/banner.webp',
  BASE_PATH + '/images/footer_logo.webp',
  BASE_PATH + '/images/arte.webp',
  BASE_PATH + '/images/ciencias.webp',
  BASE_PATH + '/images/educacaofisica.webp',
  BASE_PATH + '/images/geografia.webp',
  BASE_PATH + '/images/historia.webp',
  BASE_PATH + '/images/linguainglesa.webp',
  BASE_PATH + '/images/liguaportuguesa.webp',
  BASE_PATH + '/images/matematica.webp',
  BASE_PATH + '/images/corousel/news1.webp',
  BASE_PATH + '/images/corousel/news2.webp',

  // Imágenes móviles
  BASE_PATH + '/images/mobile/banner.webp',
  BASE_PATH + '/images/mobile/footer_logo.webp',
  BASE_PATH + '/images/mobile/arte.webp',
  BASE_PATH + '/images/mobile/ciencias.webp',
  BASE_PATH + '/images/mobile/educacaofisica.webp',
  BASE_PATH + '/images/mobile/geografia.webp',
  BASE_PATH + '/images/mobile/historia.webp',
  BASE_PATH + '/images/mobile/linguainglesa.webp',
  BASE_PATH + '/images/mobile/liguaportuguesa.webp',
  BASE_PATH + '/images/mobile/matematica.webp',
  BASE_PATH + '/images/mobile/corousel/news1.webp',
  BASE_PATH + '/images/mobile/corousel/news2.webp'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('SW: Cacheando recursos:', urlsToCache.length);
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediatamente
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Solo interceptar recursos de nuestro sitio
  if (!event.request.url.includes('future-forge-solutions.github.io')) {
    // No interceptar solicitudes de Google Fonts
    if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) {
      return;
    }
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('SW: Sirviendo desde caché:', event.request.url);
          return response;
        }

        console.log('SW: Descargando:', event.request.url);
        return fetch(event.request).then(function(response) {
          // Solo cachear respuestas exitosas
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          // Cachear todos los recursos estáticos agresivamente
          if (event.request.url.includes('.webp') ||
              event.request.url.includes('.woff2') ||
              event.request.url.includes('.css') ||
              event.request.url.includes('.js') ||
              event.request.url.includes('.svg') ||
              event.request.url.includes('anos_iniciais_test')) {

            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('SW: Cacheando recurso:', event.request.url);
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(function() {
          console.log('SW: Error de red para:', event.request.url);
          return caches.match(event.request);
        });
      })
  );
});