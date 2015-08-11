#!/usr/bin/env node

var fs        = require('fs');
var http      = require('http');
var gitConfig = require('git-config');
var $rdf      = require('rdflib');

var domain = 'gitpay.org';
var config = gitConfig.sync();

/*
* btc gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function btc(argv, callback) {
  var id = argv[2];

  if (!id) {
    id = config.gitpay.nick;
  }  

  if (!id) {
    console.log('id is required');
    process.exit(-1);
  }



  var TIMEOUT = 2000;
  var CURR  = $rdf.Namespace("https://w3id.org/cc#");

  var g = $rdf.graph();
  var f = $rdf.fetcher(g, 2000);

  var url = 'http://' + domain + '/' + id;
  f.nowOrWhenFetched(url, null, function() {
    var btm = g.statementsMatching(null, CURR('bitmark'), null, $rdf.sym(url));
    var btc = g.statementsMatching(null, CURR('bitcoin'), null, $rdf.sym(url));
    var t3 = g.statementsMatching(null, CURR('testnet3'), null, $rdf.sym(url));
    var ret = btc.concat(btm).concat(t3);
    callback(null, ret);
  });


}


/*
* btc as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/

function bin(argv) {
  btc(argv, function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].object.value);
    }
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = btc;
