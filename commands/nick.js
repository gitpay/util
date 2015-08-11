#!/usr/bin/env node

var fs        = require('fs');
var http      = require('http');
var gitConfig = require('git-config');
var $rdf      = require('rdflib');

var domain = 'gitpay.org';
var config = gitConfig.sync();

/*
* nick gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function nick(argv, callback) {

  if (config.gitpay.nick) {
    console.log('your nick is set to');
    console.log(config.gitpay.nick);
    process.exit(0);
  }

  var id = argv[2];
  if (!id) {
    console.log('github nick is required (not including http etc.)');
    process.exit(-1);
  }

  console.log("Your gitpay nick is not yet set. You can set it by typing:");
  console.log("git config --global gitpay.nick "+id);

}


/*
* nick as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  nick(process.argv, function(err, res){
    console.log(res);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = nick;
