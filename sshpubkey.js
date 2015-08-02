#!/usr/bin/env node

var fs = require("fs");
var forge = require('node-forge');
var debug = require('debug')('converter');
var BigInteger = forge.jsbn.BigInteger;


/*
* getField from asn.1
*
* @param {String} keyBytes
* @param {int} start
* @param {int} bytesLength
**/
function getField (keyBytes, start, bytesLength) {
  bytesLength = bytesLength || 4;
  // First get the length of the next field
  var lengthEnd = start + bytesLength;
  var lengthBytes = keyBytes.slice(start, lengthEnd);
  var lengthValue = 0x100 * lengthBytes.charCodeAt(bytesLength - 2) + lengthBytes.charCodeAt(bytesLength - 1);

  // Then get the field
  var bytesEnd = lengthEnd + lengthValue;
  var bytes = keyBytes.slice(lengthEnd, bytesEnd);
  // return where the bytes start and the bytes
  return {end: bytesEnd, bytes: bytes};
}



function convertKeys (public, callback) {
  fs.readFile(public, 'utf8', function (err, publicFile) {
    if (err) return callback(err);

    var convertedPublic = convertPublic(publicFile);
    debug('Public key converted : ' + convertedPublic);

    return callback(null, {
      public: convertedPublic,
    });

  });
}

function convertPublic (publicFile) {
  // Public Key

  var bytesLength = 4;

  // Get the main Key
  var mainKey = publicFile.toString().split(' ')[1]; // [0] is prefix
  var keyBytes = forge.util.decode64(mainKey);

  // Get fields
  var type = getField(keyBytes, 0);
  var exponent = getField(keyBytes, type.end);
  var modulus = getField(keyBytes, exponent.end);

  // Convert pub key to big int
  var convertedPublic = forge.pki.setRsaPublicKey(new BigInteger(forge.util.bytesToHex(modulus.bytes), 16), new BigInteger(forge.util.bytesToHex(exponent.bytes), 16));

  return convertedPublic;
}


/*
* Convert as a command
*
* @param {String} argv[2] login
* @param {String} argv[3] public
* @param {String} argv[4] private
* @param {String} argv[5] pemFile
* @callback {bin~cb} callback
**/
function bin(argv) {
  var login = argv[2];
  var public = argv[3] || './id_rsa.pub';

  convertKeys(public, function(err, pub) {
    if (err) {
      console.log(err);
    }
    console.log(pub);
  });
}


// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = convertKeys;
