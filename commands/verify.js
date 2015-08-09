#!/usr/bin/env node

var http = require('http');
var $rdf = require('rdflib');
var fs = require('fs');
var forge = require('node-forge');
var BigInteger = forge.jsbn.BigInteger;


var domain = 'gitpay.org';

/*
* verify gets response in turtle for a given user
*
* @param {String} argv[2] key
* @param {String} argv[3] message
* @param {String} argv[3] signature
* @callback {bin~cb} callback
**/
function verify(argv, callback) {
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

  var signature = argv[4];
  if (!signature) {
    console.log('signature is required');
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

    var md = forge.md.sha1.create();
    md.update(message, 'utf8');
    var verified = pub.publicKey.verify(md.digest().bytes(), forge.util.hexToBytes(signature));

    callback(null, verified);
  });

}


/*
* verify as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  verify(argv, function(err, res) {
    console.log(res);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = verify;
