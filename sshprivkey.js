#!/usr/bin/env node

var fs = require("fs");
var forge = require('node-forge');
var debug = require('debug')('converter');
var BigInteger = forge.jsbn.BigInteger;


function convertKeys (private, callback) {
  fs.readFile(private, 'utf8', function (err, privateFile) {
    if (err) return callback(err);

    var convertedPrivate = convertPrivate(privateFile);
    debug('Private key converted : ' + convertedPrivate);

    return callback(null, {
      private: convertedPrivate,
    });

  });
}

function convertPrivate (privateFile) {
  debug(privateFile);
  return forge.pki.privateKeyFromPem(privateFile);
}


/*
* Convert as a command
*
* @param {String} argv[2] private
* @callback {bin~cb} callback
**/
function bin(argv) {
  var private = argv[2] || './id_rsa';

  convertKeys(private, function(err, priv) {
    if (err) {
      console.log(err);
    }
    console.log(priv);
  });
}


// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = convertKeys;
