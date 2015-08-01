#!/usr/bin/env node

// requires
var forge = require('node-forge');
var fs    = require("fs");

// init
var sshpubkey = {};
var pubkey;


// process command line arguments : pubkeyFile
var argv       = process.argv;
var pubkeyfile = argv[2];


// get pubkeyfile
var home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
if (!pubkeyfile) {
  pubkeyfile = home + '/.ssh/id_rsa.pub';
}
console.log('getting public key from : ' + pubkeyfile);
try {
  pubkey = fs.readFileSync(pubkeyfile, "utf8");
} catch(e) {
  console.log('could not load : ' + pubkeyfile);
  console.log(e);
  process.exit(-1);
}


// get prefix
try {
  var arr = pubkey.toString().split(' ');
  if (arr.length < 2) {
    throw "Malformed key split length " + arr.length;
  }
  sshpubkey.prefix = arr[0];
  sshpubkey.mainkey = arr[1];
} catch(e) {
  console.log('could not parse key : ' + pubkey);
  console.log(e);
  process.exit(-1);
}

sshpubkey.keybytes = forge.util.decode64(sshpubkey.mainkey);
sshpubkey.keyhex = forge.util.bytesToHex(sshpubkey.keybytes);

sshpubkey.byteslen = 4;

// type
//
//
sshpubkey.typelenstart = 0;
sshpubkey.typelenend = sshpubkey.typelenstart + sshpubkey.byteslen;
sshpubkey.typelenbytes = sshpubkey.keybytes.slice(sshpubkey.typelenstart, sshpubkey.typelenend);
sshpubkey.typelen = sshpubkey.typelenbytes.charCodeAt(sshpubkey.byteslen-1);

sshpubkey.typestart = sshpubkey.typelenend;
sshpubkey.typeend = sshpubkey.typestart + sshpubkey.typelen;
sshpubkey.typebytes = sshpubkey.keybytes.slice(sshpubkey.typestart, sshpubkey.typeend);

// exponent
//
//
sshpubkey.exponentlenstart = sshpubkey.typeend;
sshpubkey.exponentlenend = sshpubkey.exponentlenstart + sshpubkey.byteslen;
sshpubkey.exponentlenbytes = sshpubkey.keybytes.slice(sshpubkey.exponentlenstart, sshpubkey.exponentlenend);
sshpubkey.exponentlen = sshpubkey.exponentlenbytes.charCodeAt(sshpubkey.byteslen-1);

sshpubkey.exponentstart = sshpubkey.exponentlenend;
sshpubkey.exponentend = sshpubkey.exponentstart + sshpubkey.exponentlen;
sshpubkey.exponentbytes = sshpubkey.keybytes.slice(sshpubkey.exponentstart, sshpubkey.exponentend);

// modulus
//
//
sshpubkey.moduluslenstart = sshpubkey.exponentend;
sshpubkey.moduluslenend = sshpubkey.moduluslenstart + sshpubkey.byteslen;
sshpubkey.moduluslenbytes = sshpubkey.keybytes.slice(sshpubkey.moduluslenstart, sshpubkey.moduluslenend);
sshpubkey.moduluslen = 256*sshpubkey.moduluslenbytes.charCodeAt(sshpubkey.byteslen-2) + sshpubkey.moduluslenbytes.charCodeAt(sshpubkey.byteslen-1);

sshpubkey.modulusstart = sshpubkey.moduluslenend;
sshpubkey.modulusend = sshpubkey.modulusstart + sshpubkey.moduluslen;
sshpubkey.modulusbytes = sshpubkey.keybytes.slice(sshpubkey.modulusstart, sshpubkey.modulusend);



console.log(parseInt(forge.util.bytesToHex(sshpubkey.exponentbytes), 16));
console.log(forge.util.bytesToHex(sshpubkey.modulusbytes));
