const CACHE_NAME = 'aprende-brasil-v4'; // Fuentes locales
const urlsToCache = [
  // Recursos principales
  '/',
  '/styles.css',
  '/js/carousel.js',
  '/icons/novedades.svg',

  // Font Awesome
  '/fontawesome/css/fontawesome-minimal.css',
  '/fontawesome/webfonts/fa-solid-900.woff2',
  '/fontawesome/webfonts/fa-brands-400.woff2',


  

  // Imágenes desktop
  '/images/banner.webp',
  '/images/footer_logo.webp',
  '/images/arte.webp',
  '/images/ciencias.webp',
  '/images/educacaofisica.webp',
  '/images/geografia.webp',
  '/images/historia.webp',
  '/images/linguainglesa.webp',
  '/images/liguaportuguesa.webp',
  '/images/matematica.webp',
  '/images/corousel/news1.webp',
  '/images/corousel/news2.webp',

  // Imágenes móviles
  '/images/mobile/banner.webp',
  '/images/mobile/footer_logo.webp',
  '/images/mobile/arte.webp',
  '/images/mobile/ciencias.webp',
  '/images/mobile/educacaofisica.webp',
  '/images/mobile/geografia.webp',
  '/images/mobile/historia.webp',
  '/images/mobile/linguainglesa.webp',
  '/images/mobile/liguaportuguesa.webp',
  '/images/mobile/matematica.webp',
  '/images/mobile/corousel/news1.webp',
  '/images/mobile/corousel/news2.webp'
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
  // No interceptar solicitudes de Google Fonts
  if (event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) {
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
              event.request.url.includes('.svg')) {

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