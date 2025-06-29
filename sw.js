self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('dynamic-v1').then((cache) => {
      return fetch(event.request).then((response) => {
        cache.put(event.request, response.clone()); // Store in cache
        return response;
      }).catch(() => caches.match(event.request)); // Serve from cache if offline
    })
  );
});
