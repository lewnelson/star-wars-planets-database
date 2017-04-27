"use strict";

import { Planets } from "./components/Planets.js";

Promise.config({
  cancellation: true
});

let planetContainerEl = document.getElementById("planets");
if(planetContainerEl !== null) {
  ReactDOM.render(<Planets />, planetContainerEl);
}