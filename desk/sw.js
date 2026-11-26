/* Broker Desk offline support: fresh from the network when online, from the saved copy when not. */
var V="bd-"+"1.4-2bf768a2",CORE=["./", "index.html", "meeting-guide.html", "manifest.json", "icons/icon-192.png", "lib/jspdf.umd.min.js", "lib/xlsx.full.min.js", "data/packs.json.js", "data/addr/meta.json.js", "data/ind-00.json.js", "data/ind-01.json.js", "data/ind-02.json.js", "data/ind-03.json.js", "data/ind-04.json.js", "data/ind-05.json.js", "data/ind-06.json.js", "data/ind-07.json.js", "data/ind-08.json.js"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf("bd-")===0&&k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var rq=e.request;if(rq.method!=="GET")return;var u=new URL(rq.url);if(u.origin!==location.origin)return;
  var big=/\/(data\/addr|lib|icons)\//.test(u.pathname);
  e.respondWith(caches.open(V).then(function(c){
    var net=function(){return fetch(rq).then(function(r){if(r&&r.ok)c.put(rq,r.clone());return r})};
    var hit=function(){return c.match(rq,{ignoreSearch:true})};
    /* large files that only change with a new version: saved copy first */
    if(big)return hit().then(function(r){return r||net()});
    return net().catch(function(){return hit().then(function(r){if(r)return r;if(rq.mode==="navigate")return c.match("index.html");throw new Error("offline")})});
  }));
});
