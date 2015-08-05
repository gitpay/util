#!/usr/bin/env node

/*
* Version number
*
**/
function help() {
  var ret = 'gipaty help\n';
  ret += 'commands\n';
  ret += '  help       - shows help message\n';
  ret += '  id <login> - shows login details in turtle\n';
  ret += '  version    - shows version number\n';
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
