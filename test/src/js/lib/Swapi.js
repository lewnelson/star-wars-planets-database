"use strict";

const axios = require("axios");
const Promise = require("bluebird");
const SwapiPath = "../../../../src/js/lib/Swapi.js";
const assert = require("assert");
const moxios = require("moxios");
import {expect} from "chai";

describe("Star Wars API library tests", () => {
  let Swapi;

  beforeEach(() => {
    Swapi = require(SwapiPath);
    moxios.install();
  });

  afterEach(() => {
    delete require.cache[require.resolve(SwapiPath)];
    moxios.uninstall();
  });

  it("uses cache", (done) => {
    let url = "/test",
        expectedData = "expected data";

    Swapi.get(url).then((response) => {
      assert.equal(expectedData, response);
      Swapi.get(url).then((cachedResponse) => {
        assert.equal(expectedData, cachedResponse);
        done();
      });
    });

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: expectedData
      });
    });
  });

  it("stores limited items in cache", (done) => {
    let baseUrl = "/test",
        i = 0,
        maxCachedItems = 100,
        promiseQueue = [];

    // Fill the cache
    while(i < maxCachedItems) {
      promiseQueue.push(Swapi.get(baseUrl + i));
      i++;

      moxios.stubRequest(/.*/, {
        status: 200,
        response: []
      });
    }

    function getIntsFromCacheUrls() {
      return Swapi.cache.slice(0).map((c) => c.url.replace(/^.*?([\d]+)$/, "$1"));
    }

    // Ensure that first request comes from cache
    Promise.all(promiseQueue).then(() => {
      assert.equal(Swapi.cache.length, maxCachedItems);
      Swapi.get(baseUrl + 0).then(() => {
        assert.equal(Swapi.cache.length, maxCachedItems);
        i++;

        // Get the next url one after max cache amount this should clear the
        // first cache item which should be /test0
        Swapi.get(baseUrl + i).then(() => {
          assert.equal(Swapi.cache.length, maxCachedItems);
          assert.equal(true, getIntsFromCacheUrls().indexOf("0") === -1);
          // Lastly get the first item again and this time which should result
          // in it being appended to the cache
          Swapi.get(baseUrl + 0).then(() => {
            assert.equal(Swapi.cache.length, maxCachedItems);
            assert.equal(true, getIntsFromCacheUrls().indexOf("0") === Swapi.cache.length - 1);
            done();
          });
        });
      });
    });
  });

  it("rejects with error when http call fails", (done) => {
    moxios.stubRequest(/.*/, {
      status: 500,
      response: "error"
    });

    Swapi.get("/example").catch((err) => {
      assert.equal(err instanceof Error, true);
      done();
    });
  });

  it("should append full url before path if only a path is provided", (done) => {
    let apiUrl = "http://swapi.co/api",
        urls = [
          {
            url: "/resources/",
            expected: apiUrl + "/resources/"
          },
          {
            url: "//swapi.co/api/planets/",
            expected: "//swapi.co/api/planets/"
          },
          {
            url: "http://swapi.co/api/films/4",
            expected: "http://swapi.co/api/films/4"
          },
          {
            url: "https://swapi.co/api/films/8",
            expected: "https://swapi.co/api/films/8"
          },
          {
            url: "http//swapi.co/api/films/8",
            expected: apiUrl + "http//swapi.co/api/films/8"
          }
        ];

    /**
     *  Recusrively test each URL
     *
     *  @param {array} urls
     *  @return {void}
     */
    function doRequests(urls) {
      if(urls.length === 0) {
        done();
        return;
      }

      let next = urls.shift();
      Swapi.get(next.url);
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request.url).to.equal(next.expected);
        doRequests(urls);
      });
    }

    doRequests(urls);
  });
});