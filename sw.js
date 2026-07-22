const CACHE_NAME = 'bintang-kelas-v3';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json']; // Jangan cache data dinamis!

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS)));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Abaikan cache untuk request ke Supabase (Single Source of Truth)
    if (e.request.url.includes('supabase.co')) return;
    
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
