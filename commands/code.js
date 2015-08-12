#!/usr/bin/env node

/*
* code of conduct
*
**/
function code(argv, callback) {
  var ret = 'please visit the gitpay code of conduct : \n  https://github.com/gitpay/code-of-conduct/blob/master/README.md \n';
  callback(null, ret);
}

/*
* version as a command
*
**/
function bin() {
  help(process.argv, function(err, ret){
    console.log(ret);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = code;
