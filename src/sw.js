/**
 * Created by Andrei Bozga on 24-04-17.
 */

importScripts('assets/js/sw-toolbox/sw-toolbox.js'); // Update path to match your own setup

const spCaches = {
  'static': 'static-v1',
  'dynamic': 'dynamic-v1'
};

self.addEventListener('install', function (event) {
  console.log("SW installed at", new Date().toLocaleTimeString());
  self.skipWaiting();

  event.waitUntil(
    caches.open(spCaches.static)
      .then(function (cache) {
        return cache.addAll([
        ])
      })
    //return Promise to activate SW
  )
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (key) {
          return !Object.values(spCaches).includes(key);
        }).map(function (key) {
          return caches.delete(key);
        }));
      }));
});

toolbox.router.get("styles/*", toolbox.cacheFirst, {
  cache: {
    name: spCaches.static,
    maxAgeSeconds: 60 * 60 * 24 * 365// 1 year
  }
});
toolbox.router.get("scripts/*", toolbox.cacheFirst, {
  cache: {
    name: spCaches.static,
    maxAgeSeconds: 60 * 60 * 24 * 365// 1 day
  }
});
toolbox.router.get("assets/*", toolbox.cacheFirst, {
  cache: {
    name: spCaches.static,
    maxAgeSeconds: 60 * 60 * 24 * 365// 1 day
  }
});

toolbox.router.get("/*", function (request, values, options) {
  return toolbox.fastest(request, values, options)
    .catch(function (err) {
      return new Response('<h1> Offline :( </h1>');
    });
}, {
  cache: {
    name: spCaches.dynamic,
    maxEntries: 50
  }
});

