"use strict";

const request = require("supertest");
const assert = require("assert");

/**
 *  Gets mock command line object
 *
 *  @param {bool} help
 *  @param {int} port
 *  @param {string} usageOutput
 *  @return {object}
 */
function getMockCommandLine(help, port, usageOutput) {
  return {
    GetOption: (key, defaultVal) => {
      return key === "help" ? help : key === "port" ? port : defaultVal;
    },
    DisplayUsage: () => usageOutput
  }
}

describe("Load server", () => {
  it("response to /", (done) => {
    let server = require("../../app/App.js").Run(getMockCommandLine(false, 8080));
    request(server)
      .get("/")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200, () => {
        server.close(done);
      });
  });

  let notFoundUrls = [
    "/1",
    "/index.html"
  ];

  for(let i = 0; i < notFoundUrls.length; i++) {
    it("responds with 404 page for url - " + notFoundUrls[i], (done) => {
      let server = require("../../app/App.js").Run(getMockCommandLine(false, 8080));
      request(server)
        .get(notFoundUrls[i])
        .expect("Content-Type", "text/html; charset=utf-8")
        .expect(404, () => {
          server.close(done);
        });
    });
  }

  it("outputs usage when help command line arg is true", () => {
    let output = "command line output",
        commandLineUsage = require("../../app/App.js").Run(getMockCommandLine(true, 8080, output));

    assert.equal(output, commandLineUsage);
  });
});