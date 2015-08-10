#!/usr/bin/env node

var fs        = require('fs');
var http      = require('http');
var gitConfig = require('git-config');
var $rdf      = require('rdflib');

var domain = 'gitpay.org';
var config = gitConfig.sync();

/*
* pubkey gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function pubkey(argv, callback) {

  if (config.gitpay.pubkey) {
    console.log('your defualt public key is set to');
    console.log(config.gitpay.pubkey);
    process.exit(0);
  }

  var id = argv[2];
  if (!id) {
    console.log('default public key URI is required');
    process.exit(-1);
  }

  console.log("Your gitpay public keys is not yet set. You can set it by typing:");
  console.log("git config --global gitpay.pubkey " + id);

}


/*
* pubkey as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function bin(argv) {
  pubkey(argv, function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].subject.value);
    }
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = pubkey;
