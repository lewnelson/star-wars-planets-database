"use strict";

import { Planets } from "./components/Planets.js";

Promise.config({
  cancellation: true
});

let planetElements = document.getElementsByClassName("planets");
for(let i = 0; i < planetElements.length; i++) {
  ReactDOM.render(<Planets />, planetElements[i]);
}