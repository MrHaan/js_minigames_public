//tutorial for PWA: https://www.freecodecamp.org/news/build-a-pwa-from-scratch-with-html-css-and-javascript/
//MDN tutorial: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers

// Files to cache
const cacheName = 'minigames_cache-v1.25'; //version name convention: v<numgames>_<update_version>
const appShellFiles = [
  '/js_minigames_public/index.html',
  '/js_minigames_public/w3.css',
  '/js_minigames_public/resources/icon_lockpicker.png',
  '/js_minigames_public/resources/icons/favicon.ico',
  '/js_minigames_public/resources/icons/favicon.svg',
  '/js_minigames_public/resources/icons/icon_apple_pinned_tab.svg',
  '/js_minigames_public/resources/icons/icon_transparent.svg',
  '/js_minigames_public/resources/icons/icon180_mask.png',
  '/js_minigames_public/resources/icons/icon192_mask.png',
  '/js_minigames_public/resources/icons/icon512_mask.png',
];
const gamesFiles = [
];

const contentToCache = appShellFiles.concat(gamesFiles);

// Installing Service Worker
self.addEventListener('install', (e) => {
  //console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    //console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    //console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    //console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});

//clear the cache items that are no longer needed in the current online cache listing
self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
          if(key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
    );
  });

//only activate the service worker when the app gives a clearance signal
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
      self.skipWaiting();
  }
});