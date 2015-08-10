#!/usr/bin/env node

/*
* help message
*
**/
function help() {
  var ret = 'gitpay help\n';
  ret += 'commands\n';
  ret += '  btc <login>                   - get bitcoin and testnet address\n';
  ret += '  code                          - shows gitpay code of conduct\n';
  ret += '  decrypt <key> <message>       - decrypt message with key file\n';
  ret += '  encrypt <key> <message>       - encrypt message with key uri\n';
  ret += '  help                          - shows help message\n';
  ret += '  id <login>                    - shows login details in turtle\n';
  ret += '  keys <login>                  - get uris of keys for a login\n';
  ret += '  me <login>                    - saves your identity for convenience\n';
  ret += '  pubkey <key>                  - saves your pub key URI for convenience\n';
  ret += '  privkey <key>                 - saves your priv key file for convenience\n';
  ret += '  sign <key> <message>          - sign message with key file\n';
  ret += '  verify <key> <message>  <sig> - verify a signature with key file and message\n';
  ret += '  version                       - shows version number\n';
  return(ret);
}

/*
* version as a command
*
**/
function bin() {
  console.log(help());
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}

module.exports = help;
