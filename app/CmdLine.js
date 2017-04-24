"use strict";

const CmdLineArgs = require("command-line-args");
const CmdLineUsage = require('command-line-usage')
const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    defaultOption: false,
    description: "Display usage guide",
  },
  {
    name: "port",
    alias: "p",
    type: Number,
    defaultOption: true,
    defaultValue : 8080,
    description: "Port for http server to listen on",
  }
];

const sections = [
  {
    header: "Star Wars Planets",
    content: "Find everything you need to know about all the planets that appear in Star Wars."
  },
  {
    header: "Usage Options",
    optionList: optionDefinitions
  }
];

const options = CmdLineArgs(optionDefinitions);

/**
 *  Get a command line option by name
 *
 *  @param {string} name
 *  @return {mixed}
 */
exports.GetOption = (name) => {
  return options[name];
}

/**
 *  Displaye command line usage then process terminates. Optionally define process
 *  exit code which defaults to 0 (OK)
 *
 *  @param {int} exitCode
 *  @return {void}
 */
exports.DisplayUsage = (exitCode) => {
  console.log(CmdLineUsage(sections));
  process.exit(exitCode || 0);
}