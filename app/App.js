"use strict";

const CmdLine = require("./CmdLine.js");
const Express = require("express");
const App = Express();
const Portfinder = require("portfinder");

// Setup express application with public static files location, views directory
// and define template engine to use for rendering views.
App.use(Express.static(__dirname + "/../public"));
App.set("views", __dirname + "/views");
App.set("view engine", "pug");

// Main route for home page
App.get("/", (req, res, next) => {
  res.render("home", {
    pageTitle: "Star Wars Planets",
    pageDescription: "Avoid the scum and villainy, plan ahead."
  });

  next();
});

// Catch for response not sent yet and assume 404 not found
App.use((req, res, next) => {
  if(res.headersSent === false) {
    let err = new Error();
    err.status = 404;
    next(err);
  }
});

// Check if error is passed and if it is a 404 error then render 404 page
App.use((err, req, res, next) => {
  if(err.status !== 404) {
    return next();
  }

  res.render("notFound", {
    pageTitle: "Resource Not Found",
    pageDescription: "The requested resource could not be found."
  });
});

module.exports = {
  Run: () => {
    if(CmdLine.GetOption("help") === true) {
      CmdLine.DisplayUsage();
    }

    let port = CmdLine.GetOption("port");
    App.listen(port, () => console.log("Server listening on port " + port));
  }
}