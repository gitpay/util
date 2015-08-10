#!/usr/bin/env node

var fs        = require('fs');
var http      = require('http');
var gitConfig = require('git-config');
var $rdf      = require('rdflib');

var domain = 'gitpay.org';
var config = gitConfig.sync();

/*
* me gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function me(argv, callback) {

  if (config.gitpay.webid) {
    console.log('your webid is set to');
    console.log(config.gitpay.webid);
    process.exit(0);
  }

  var id = argv[2];
  if (!id) {
    console.log('github nick is required (not including http etc.)');
    process.exit(-1);
  }

  console.log("Your gitpay identity is not yet set. You can set it by typing:");
  console.log("git config --global gitpay.webid http://"+domain+ "/" + id + "#this");

}


/*
* me as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  me(argv, function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].subject.value);
    }
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = me;
