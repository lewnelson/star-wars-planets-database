"use strict";

// Define globals that are not bundled in app
global.axios = require("axios");
global.Promise = require("bluebird");

// Setup document
const jsdom = require("jsdom");

global.document = new jsdom.JSDOM("").window.document;
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js"
};

global.React = require("react");
global.ReactDOM = require("react-dom");