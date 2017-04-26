"use strict";

const apiUrl = "http://swapi.co/api";
let cache = {};

/**
 *  Load from cache object
 *
 *  @param {string} url
 *  @return {object|null} Returns null on cache miss
 */
function getFromCache(url) {
  return cache[url] || null;
}

/**
 *  Send GET request to swapi will attempt to retrieve cached response first
 *
 *  @param {string} uri Relative path or full url
 *  @return {Promise}
 */
exports.get = (uri) => {
  if(uri.match(/^(\/\/|http:)/) === null) {
    uri = apiUrl + uri;
  }

  return new ES6Promise((resolve, reject) => {
    let cachedResponse = getFromCache(uri);
    if(cachedResponse !== null) {
      resolve(cachedResponse);
    } else {
      axios.get(uri).then((response) => {
        cache[uri] = response.data;
        resolve(response.data);
      }).catch((err) => reject(err));
    }
  });
}