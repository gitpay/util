#!/usr/bin/env node

var http = require('http');
var $rdf = require('rdflib');
var fs = require('fs');
var forge = require('node-forge');
var BigInteger = forge.jsbn.BigInteger;


var domain = 'gitpay.org';

/*
* encrypt gets response in turtle for a given user
*
* @param {String} argv[2] key
* @param {String} argv[3] message
* @callback {bin~cb} callback
**/
function encrypt(argv, callback) {
  var key = argv[2];
  if (!key) {
    console.log('key is required');
    process.exit(-1);
  }

  var message = argv[3];
  if (!message) {
    console.log('message is required');
    process.exit(-1);
  }

  var TIMEOUT = 2000;
  var CERT  = $rdf.Namespace("http://www.w3.org/ns/auth/cert#");

  var g = $rdf.graph();
  var f = $rdf.fetcher(g, TIMEOUT);

  var url = key.split('#')[0];
  f.nowOrWhenFetched(url, null, function() {
    var pub = {};
    pub.exponent = g.any($rdf.sym(key), CERT('exponent'), null,  $rdf.sym(url));
    pub.modulus = g.any($rdf.sym(key), CERT('modulus'), null,  $rdf.sym(url));
    pub.key = g.statementsMatching($rdf.sym(key), null, null,  $rdf.sym(url));
    pub.publicKey = forge.pki.setRsaPublicKey(new BigInteger(pub.modulus.value, 16), new BigInteger(pub.exponent.value));
    var buffer = forge.util.createBuffer(message, 'utf8');
    var encrypted = pub.publicKey.encrypt(buffer);
    buffer = forge.util.createBuffer(encrypted, 'utf8');
    callback(null, buffer.toHex());
  });

}


/*
* encrypt as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  encrypt(argv, function(err, res) {
    console.log(res);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = encrypt;
