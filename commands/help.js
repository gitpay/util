#!/usr/bin/env node

/*
* help message
*
**/
function help() {
  var ret = 'gitpay help\n';
  ret += 'commands\n';
  ret += '  code                    - shows gitpay code of conduct\n';
  ret += '  decrypt <key> <message> - decrypt message with key file\n';
  ret += '  encrypt <key> <message> - encrypt message with key uri\n';
  ret += '  help                    - shows help message\n';
  ret += '  id <login>              - shows login details in turtle\n';
  ret += '  keys <login>            - get uris of keys for a login\n';
  ret += '  version                 - shows version number\n';
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
