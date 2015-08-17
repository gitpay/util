#!/usr/bin/env node

var exec      = require('child_process').exec;
var fs        = require('fs');
var gitConfig = require('git-config');
var http      = require('http');
var $rdf      = require('rdflib');

var domain    = 'gitpay.org';
var config    = gitConfig.sync();

/*
* init gets response in turtle for a given user
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function init(argv, callback) {

  var TIMEOUT = 2000;
  var CERT  = $rdf.Namespace("http://www.w3.org/ns/auth/cert#");
  var FOAF  = $rdf.Namespace("http://xmlns.com/foaf/0.1/");

  var g = $rdf.graph();
  var f = $rdf.fetcher(g, 2000);

  initPrivkey();
  initNick(function(err, res) {
    if (!err) {
      initPubkey(res);
    } else {
      console.error(err);
    }
  });

  function initPrivkey() {
    getPrivkey(function(err, ret) {
      if (!err) {
        console.log(ret);
        setPrivkey(ret, function(err, stdout, stderr) {
          if (!err) {
            console.log('privkey set');
          } else {
            console.log(eff);
          }
        });
      } else {
        console.error(err);
      }
    });
  }


  function initPubkey(nick) {
    getPubkey(nick, function(err, ret) {
      if (!err) {
        console.log(ret);
        setPubkey(ret, function(err, stdout, stderr) {
          if (!err) {
            console.log('pubkey set');
          } else {
            console.log(eff);
          }
        });
      } else {
        console.error(err);
      }
    });
  }

  function getPubkey(nick, callback) {
    var pubkey;

    console.log('searching for pubkey...');
    console.log('try congig file');

    if (config && config.gitpay && config.gitpay.pubkey) {
      pubkey = config.gitpay.pubkey;
      console.log('pubkey found in config file : ' + pubkey);
      callback(null, pubkey);
      return;
    }


    if (!pubkey) {
      url = 'http://' + domain + '/' + nick;
      f.nowOrWhenFetched(url, null, function(ok, res) {
        if (!ok) callback(ok);
        var ret = g.statementsMatching(null, null, CERT('RSAPublicKey'), $rdf.sym(url));
        if (ret && ret.length) {
          pubkey = ret[ret.length-1].subject.value;
          callback(null, pubkey);
        } else {
          callback(null, null);
        }
      });

    }
  }


  function setPubkey(pubkey, callback) {
    exec('git config --global gitpay.pubkey ' + pubkey, callback);
  }






  function getPrivkey(callback) {
    var privkey;
    var home = getUserHome();
    var defaultPrivkey = home + '/.ssh/id_rsa';

    console.log('searching for privkey...');
    console.log('try congig file');

    if (config && config.gitpay && config.gitpay.privkey) {
      privkey = config.gitpay.privkey;
      console.log('privkey found in config file : ' + privkey);
      callback(null, privkey);
      return;
    }


    if (!privkey) {
      if (fs.lstatSync(defaultPrivkey)) {
        console.log('privkey found in : ' + defaultPrivkey);
        callback(null, defaultPrivkey);
      }
    }
  }


  function setPrivkey(privkey, callback) {
    exec('git config --global gitpay.privkey ' + privkey, callback);
  }


  function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  function initNick(callback) {
    var nick;
    getNick(function(err, res) {
      if (!err) {
        if (res) {
          nick = res;
          console.log('nick is : ' + nick);
          setNick(nick, function(err, stdout, stderr) {
            if (!err) {
              console.log('set nick to ' + nick);
              callback(null, nick);
            } else {
              console.log(err);
            }
          });
        }
      } else {
        console.error(err);
      }
    });
  }



  function setNick(nick, callback) {
    exec('git config --global gitpay.nick ' + nick, callback);
  }


  function getNick(callback) {
    var nick;

    console.log('searching for nick...');
    console.log('try congig file');

    if (config && config.gitpay && config.gitpay.nick) {
      nick = config.gitpay.nick;
      console.log('nick found in config file : ' + nick);
      callback(null, nick);
      return;
    }


    console.log('try congig arguments');
    if (!nick) {
      if (process.argv[2]) {
        callback(null, process.argv[2]);
        return;
      }
    }

    var email;
    if (!nick) {
      console.log('trying email address : ');
      if (config && config.user && config.user.email) {
        email = config.user.email;
        console.log('email is : ' + email);
      }
      if (email) {
        getNickFromEmail(email, callback);
      }
    }
  }

  function getNickFromEmail(email, callback) {

    var url = 'http://' + domain + '/.well-known/webfinger?object=' + email;
    console.log('fetching : ' + url);
    f.nowOrWhenFetched(url, null, function(ok, res) {
      if (!ok) callback(ok);
      var ret = g.statementsMatching(null, FOAF('nick'), null, $rdf.sym(url));
      if (ret && ret.length) {
        nick = ret[0].object.value;
        callback(null, nick);
      } else {
        callback(null, null);
      }
    });

  }

}


/*
* init as a command
*
* @param {String} argv[2] login
* @callback {bin~cb} callback
**/
function bin(argv) {
  init(argv, function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i]);
    }
  });
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
  bin(process.argv);
}


module.exports = init;
