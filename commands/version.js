#!/usr/bin/env node

var VERSION = '0.0.0';

/*
* Version number
*
**/
function version() {
  console.log(VERSION);
}


function bin() {
  version();
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = version;
