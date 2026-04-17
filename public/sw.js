self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Empty listener.
  // This satisfies Chrome's PWA install requirement
  // WITHOUT interfering with Next.js App Router caching.
  return;
});
