#!/usr/bin/env node

/*
* gitpay calls child script
*
* @param {String} argv[2] command
* @callback {bin~cb} callback
**/
function gitpay(argv, callback) {
  var command = argv[2];
  var exec;

  if (!command) {
    console.log('gitpay help for command list');
    process.exit(-1);
  }
  exec = require('./commands/' + command + '.js');

  argv.splice(2, 1);

  exec(argv, callback);

}

/*
* git-pay as a command
*
**/
function bin() {
  gitpay(process.argv, function(err, res){
    console.log(res);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = gitpay;
