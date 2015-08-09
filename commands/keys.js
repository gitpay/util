#!/usr/bin/env node

var http = require('http');
var $rdf = require('rdflib');
var fs = require('fs');
var domain = 'gitpay.org';

/*
* keys gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function keys(argv, callback) {
  var id = argv[2];
  if (!id) {
    console.log('id is required');
    process.exit(-1);
  }

  var TIMEOUT = 2000;
  var CERT  = $rdf.Namespace("http://www.w3.org/ns/auth/cert#");

  var g = $rdf.graph();
  var f = $rdf.fetcher(g, 2000);

  var url = 'http://' + domain + '/' + id;
  f.nowOrWhenFetched(url, null, function() {
    var keys = g.statementsMatching(null, null, CERT('RSAPublicKey'), $rdf.sym(url));
    callback(null, keys);
  });


}


/*
* keys as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  keys(argv, function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].subject.value);
    }
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = keys;
