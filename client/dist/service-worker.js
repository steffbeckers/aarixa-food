"use strict";var precacheConfig=[["index.html","c63fc078fc32f75e2857dfe68041663a"],["service-worker.js","25edb144d3e8422f3cd8161aa27d52df"],["static/css/app.eb6bc10446782ebea95092e81eaeb20c.css","960e711c64a962c4b436ff9d967ad8e5"],["static/explorer/css/loopbackStyles.css","b1146f169aa301086ebd88431a3cc619"],["static/explorer/images/favicon-32x32.png","1dd4d618b2b19ea7262f769ae93e8e03"],["static/explorer/index.html","cb170988d97559f2199957bb6534172e"],["static/fonts/fontawesome-webfont.af7ae50.woff2","af7ae505a9eed503f8b8e6982036873e"],["static/fonts/fontawesome-webfont.b06871f.ttf","b06871f281fee6b241d60582ae9369b9"],["static/fonts/fontawesome-webfont.fee66e7.woff","fee66e712a8a08eef5805a46892932ad"],["static/img/aariXa_Logo.6ad6f1f.png","6ad6f1f7b18c879748f01325c70187d7"],["static/img/aariXa_Logo.png","6ad6f1f7b18c879748f01325c70187d7"],["static/img/aariXa_Shield.png","8f937a6f2cc937158f68bc49c8fcd293"],["static/img/aariXa_Shield_1x1.png","9eb65a5f0378c75f0c60aaa3fd9e691d"],["static/img/aariXa_Shield_32x32.1dd4d61.png","1dd4d618b2b19ea7262f769ae93e8e03"],["static/img/icons/android-chrome-192x192.png","d81c6ff39e54fff55e436a0415747a05"],["static/img/icons/android-chrome-512x512.png","41bff08ef327771e1ac025caed2dad80"],["static/img/icons/apple-touch-icon-152x152.png","6b24871dec6d979655b0b8b0b21ec0bf"],["static/img/icons/apple-touch-icon.png","d81c6ff39e54fff55e436a0415747a05"],["static/img/icons/favicon-16x16.png","871e2a1880fad3484935fe0f723b7b96"],["static/img/icons/favicon-32x32.png","1dd4d618b2b19ea7262f769ae93e8e03"],["static/img/icons/msapplication-icon-144x144.png","ccd9ace20a736b3fb3c0a60fe611078c"],["static/img/icons/mstile-150x150.png","6b24871dec6d979655b0b8b0b21ec0bf"],["static/js/app.5403c67bb7543312a19c.js","7ecba363c3c60db067e04d654feec562"],["static/js/manifest.2ae2e69a05c33dfc65f8.js","2f4fd3b092ed7f7e76dbb3976729742e"],["static/js/vendor.5920accce6f33e2c6347.js","93873cfce2a6ca7f92d4db8df4174176"]],cacheName="sw-precache-v3-aarixa-food-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,a,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),c=createCacheKey(n,hashParamName,a,!1);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var n=new Request(a,{credentials:"same-origin"});return fetch(n).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,"index.html"),t=urlsToCacheKeys.has(a));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});