var CACHE = 'benmed-v1';
var ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) { return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  // Network-first for Firebase/Google APIs
  if (url.hostname.indexOf('googleapis.com') !== -1 ||
      url.hostname.indexOf('firebaseio.com') !== -1 ||
      url.hostname.indexOf('gstatic.com') !== -1 ||
      url.hostname.indexOf('firestore.googleapis.com') !== -1 ||
      url.hostname.indexOf('identitytoolkit.googleapis.com') !== -1 ||
      url.hostname.indexOf('securetoken.googleapis.com') !== -1) {
    return;
  }
  // Cache-first for app assets
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        if (resp.ok) {
          var clone = resp.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return resp;
      });
    })
  );
});
