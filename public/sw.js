const CACHE_NAME = 'edublog-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  try {
    const db = await indexedDB.open('edublog', 1);
    const pendingChanges = await db.transaction('syncQueue').objectStore('syncQueue').getAll();
    
    // Process pending changes
    for (const change of pendingChanges) {
      // Implement sync logic here
      console.log('Syncing change:', change);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}