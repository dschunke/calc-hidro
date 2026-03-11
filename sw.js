// ATENÇÃO: Toda vez que você atualizar o index.html, mude o número da versão aqui!
// Exemplo: 'calc-hidro-v2', 'calc-hidro-v3', etc.
const CACHE_NAME = 'calc-hidro-v0'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', event => {
  // Força a atualização imediata do Service Worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta as requisições para funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// NOVO: Evento Activate para limpar os caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se o cache antigo não for o atual, ele é deletado
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle imediatamente
  );
});