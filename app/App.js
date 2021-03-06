"use strict";

const Express = require("express");

/**
 *  Create server instance
 *
 *  @return {Express} Get instance of Express server configured for server
 */
function createServer() {
  const App = Express();

  // Setup express application with public static files location, views directory
  // and define template engine to use for rendering views.
  App.use(Express.static(__dirname + "/../public"));
  App.set("views", __dirname + "/views");
  App.set("view engine", "pug");

  // Main route for home page
  App.get("/", (req, res, next) => {
    res.render("home", {
      pageTitle: "Star Wars Planets Database",
      pageDescription: "Information on planets from the Star Wars universe."
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

  return App;
}

module.exports = {
  /**
   *  Run server and return instance
   *
   *  @param {Object} CmdLine Command line library
   *  @return {HttpServer} Express server instance
   */
  Run: (CmdLine) => {
    if(CmdLine.GetOption("help") === true) {
      return CmdLine.DisplayUsage();
    }

    let port = CmdLine.GetOption("port"),
        App = createServer(),
        server = App.listen(port, () => console.log("Server listening on port " + port));
        
    return server;
  }
}