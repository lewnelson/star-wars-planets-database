"use strict";

const apiUrl = "http://swapi.co/api";

// Maximum items to store in the cache, once limit is reached the cache should
// clear out oldest item to make room
const maxStorage = 3;
let cache = [];

/**
 *  Load from cache object
 *
 *  @param {string} url
 *  @return {object|null} Returns null on cache miss
 */
function getFromCache(url) {
  let hit = null,
      cachedResponses = cache.slice(0);

  while(cachedResponses.length > 0 && hit === null) {
    let next = cachedResponses.shift();
    if(next.url === url) {
      hit = JSON.parse(JSON.stringify(next.response));
    }
  }

  return hit;
}

/**
 *  Add a response to the cache
 *
 *  @param {string} uri
 *  @param {object} response
 *  @return {void}
 */
function addToCache(uri, response) {
  if(cache.length > maxStorage) {
    cache.shift();
  }

  cache.push({
    url: uri,
    response: response
  });
}

let i = 0;

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

  return new Promise((resolve, reject) => {
    let cachedResponse = getFromCache(uri);
    if(cachedResponse !== null) {
      resolve(cachedResponse.data);
    } else {
      axios.get(uri).then((response) => {
        addToCache(uri, response);
        console.log(response, uri);
        resolve(response.data);
      }).catch((err) => reject(err));
    }
  });
}