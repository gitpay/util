#!/usr/bin/env node

var VERSION = '0.0.2';

/*
* Version number
*
**/
function version() {
  return(VERSION);
}

/*
* version as a command
*
**/
function bin() {
  console.log(version());
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = version;
