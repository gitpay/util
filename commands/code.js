#!/usr/bin/env node

/*
* code of conduct
*
**/
function code() {
  var ret = 'gitpay code of conduct : https://github.com/gitpay/code-of-conduct/blob/master/README.md \n';
  return(ret);
}

/*
* version as a command
*
**/
function bin() {
  console.log(code());
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = code;
