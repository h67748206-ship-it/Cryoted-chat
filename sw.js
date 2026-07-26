var CACHE = 'xenity-secure-v3';
var SHELL = ['./index.html', './manifest.json', './icon.png'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  if(e.request.url.indexOf('ntfy.sh') !== -1) return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
