"use strict";

const sinon = require("sinon");
const axios = require("axios");
const Promise = require("bluebird");
const SwapiPath = "../../../../src/js/lib/Swapi.js";
const assert = require("assert");

describe("Star Wars API library tests", () => {
  let sandbox,
      Swapi;

  beforeEach(() => {
    Swapi = require(SwapiPath);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    delete require.cache[require.resolve(SwapiPath)];
    sandbox.restore();
  });

  it("uses cache", (done) => {
    let url = "/test",
        expectedData = "expected data",
        promise = new Promise((r) => r({data: expectedData}));

    sandbox.stub(axios, "get").returns(promise);
    Swapi.get(url).then((response) => {
      assert.equal(expectedData, response);
      sandbox.restore();
      sandbox.stub(axios, "get").returns(new Promise((r) => r({data: ""})));

      Swapi.get(url).then((cachedResponse) => {
        assert.equal(expectedData, cachedResponse);
        done();
      });
    });
  });

  it("stores limited items in cache", (done) => {
    let baseUrl = "/test",
        count = 0,
        i = 0,
        maxCachedItems = 3,
        promiseQueue = [];

    function incrementCounter(r) {
      count++;
      r({data: []});
    }

    function getCount() {
      return count;
    }

    // Fill the cache
    while(i < maxCachedItems) {
      sandbox.restore();
      sandbox.stub(axios, "get").returns(new Promise(incrementCounter));
      promiseQueue.push(Swapi.get(baseUrl + i));
      i++;
    }

    // Ensure that first request comes from cache
    Promise.all(promiseQueue).then(() => {
      assert.equal(getCount(), maxCachedItems);
      Swapi.get(baseUrl + 0).then(() => {
        assert.equal(getCount(), maxCachedItems);
        i++;

        sandbox.restore();
        sandbox.stub(axios, "get").returns(new Promise(incrementCounter));

        // Get the 101st url this should clear the first cache item which should
        // be /test0
        Swapi.get(baseUrl + i).then(() => {
          assert.equal(getCount(), maxCachedItems + 1);

          sandbox.restore();
          sandbox.stub(axios, "get").returns(new Promise(incrementCounter));

          // Lastly get the first item again and this time the count should increase
          // once more
          Swapi.get(baseUrl + 0).then(() => {
            assert.equal(getCount(), maxCachedItems + 2);
            done();
          });
        });
      });
    });
  });
});