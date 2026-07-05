const SHELL_CACHE = 's2c-shell-v3';
const DATA_CACHE  = 's2c-data-v2';

const SHELL_FILES = [
    '/style.css',
    '/state.js',
    '/data.js',
    '/data-manager.js',
    '/render-courses.js',
    '/render-hub.js',
    '/render-sectors.js',
    '/init.js',
    '/manifest.json',
    '/vendor/tailwind.js',
    '/vendor/chart.min.js',
    '/vendor/lucide.min.js',
    '/vendor/jspdf.umd.min.js',
];

const DATA_FILES = [
    '/wages.json',
    '/courses.json',
    '/ventures.json',
    '/top_occupations.json',
    '/top_skills.json',
    '/app_data.json',
    '/resources_general.json',
    '/resources_evidence.json',
    '/resources_digital.json',
    '/resources_agri.json',
    '/resources_energy.json',
    '/scholarships.json',
    '/sector_data.json',
];

// Install: cache app shell eagerly (index.html excluded — always fetched fresh)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then(cache => cache.addAll(SHELL_FILES))
            .then(() => self.skipWaiting())
    );
});

// Activate: delete all stale caches from previous SW versions
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== SHELL_CACHE && k !== DATA_CACHE)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests
    if (url.origin !== location.origin) return;

    // Always fetch HTML fresh from the network so every deploy is seen immediately.
    // Fall back to cache only if offline.
    if (event.request.mode === 'navigate' ||
        url.pathname === '/' ||
        url.pathname.endsWith('.html')) {
        event.respondWith(networkFirst(event.request, SHELL_CACHE));
        return;
    }

    const isData = DATA_FILES.some(f => url.pathname === f);

    if (isData) {
        // Stale-while-revalidate for JSON data files
        event.respondWith(staleWhileRevalidate(event.request, DATA_CACHE));
    } else {
        // Cache-first for versioned JS/CSS/vendor assets
        event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    }
});

async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached || new Response('Offline — please reconnect and refresh.', { status: 503 });
    }
}

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        return new Response('Offline — resource not cached', { status: 503 });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
    }).catch(() => null);

    return cached || await fetchPromise || new Response('[]', {
        headers: { 'Content-Type': 'application/json' }
    });
}
