#!/usr/bin/env node

var VERSION = '0.0.5';

/*
* Version number
*
**/
function version(argv, callback) {
  var ret = 'gitpay version : ' + VERSION;
  callback(null, ret);

}

/*
* version as a command
*
**/
function bin() {
  version(process.argv, function(err, ret){
    console.log(ret);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = version;
