#!/usr/bin/env node

var fs        = require('fs');
var http      = require('http');
var gitConfig = require('git-config');
var $rdf      = require('rdflib');

var domain = 'gitpay.org';
var config = gitConfig.sync();

/*
* id gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function id(argv, callback) {
  var nick = argv[2];

  if (!nick) {
    if (config.gitpay) {
      nick = config.gitpay.nick;      
    }
  }

  if (!id) {
    console.log('nick is required');
    process.exit(-1);
  }

  var options = {
      host: domain,
      port: 80,
      method: 'GET',
      path: '/' + nick,
      //key: fs.readFileSync('ssl/client.key'),
      //cert: fs.readFileSync('ssl/client.crt'),
      //passphrase: 'password', // doesn't seem to work...
      headers: { 'Accept' : 'text/turtle'}
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');

    var data = '';

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function (chunk) {
      callback(null, data);
    });


  });
  req.end();

}


/*
* id as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  id(argv, function(err, res) {
    console.log(res);
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = id;
