# star-wars-planets-database
Javascript application using react to interact with the swapi to display lists of planets. This is a basic application that makes use of react to render a table displaying planets data from http://swapi.co/. The data is filterable, searchable and has pagination. The server only renders the basic HTML page and react takes over from there on the front end to retrieve data from the API and display it in the table.

## Demo
http://swplanets.lewnelson.com/

## Dependencies
1. node >= 6.10
1. npm >= 3.10
1. sass >= 3.4

## Development Quickstart
```
npm install
npm install -g gulp  # If gulp command is not available
gulp
node index.js -p [port]  # where port is the port that the http server binds to
```

## Getting Started With Docker
A docker image is available publicly here https://hub.docker.com/r/lewnelson/star-wars-planets-database/.

## Getting Started With Node
1. npm install
1. Build static files from source with gulp, there are three tasks available
    - dev - builds with sourcemaps.
    - prod - builds without sourcemaps.
    - watch - same as dev, but watches for changes to source files to recompile.
1. Start server, running `node index.js` will output command line options. Currently allows option of binding http server to specified port.
