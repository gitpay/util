var fs = require("fs");
var forge = require('node-forge');
var debug = require('debug')('converter');
var BigInteger = forge.jsbn.BigInteger;

/*
* Convert
*
* @param {String} login
* @param {String} public
* @param {String} private
* @param {String} pem
* @callback {convert~cb} callback
**/
function convert(login, public, private, pem, callback) {
  if (!login) {
    debug('github nick is required');
    callback(new Error('github nick is required'));
  }

  // First convert the keys
  convertKeys(public, private, function(err, converted) {
    if (err) return callback(err);

    // Create certificate
    var cert = createCert(login, converted);

    // Check certificate is valid
    var verified = verifyCert(cert);
    if (!verified) {
      return callback(new Error('Certificate failed to validate'));
    }

    // Create pem
    var pem = {
      privateKey: forge.pki.privateKeyToPem(converted.private),
      publicKey: forge.pki.publicKeyToPem(converted.public),
      certificate: forge.pki.certificateToPem(cert)
    };

    return callback(null, pem);
  });
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
  var private = argv[4] || './id_rsa';
  var pemFile = argv[5] || './id_rsa.pem';

  convert(login, public, private, pemFile, function(err, pem) {
    if (err) {
      console.log(err);
    }
    fs.writeFileSync(pemFile, pem.privateKey + '\n' + pem.certificate);
  });
}


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
  var convertedPublic = forge.pki.setRsaPublicKey(
    new BigInteger(forge.util.bytesToHex(modulus.bytes), 16),
    new BigInteger(forge.util.bytesToHex(exponent.bytes), 16));

  return convertedPublic;
}

function convertPrivate (privateFile) {
  debug(privateFile);
  return forge.pki.privateKeyFromPem(privateFile);
}

function convertKeys (public, private, callback) {
  fs.readFile(public, 'utf8', function (err, publicFile) {
    if (err) return callback(err);

    fs.readFile(private, 'utf8', function (err, privateFile) {
      if (err) return callback(err);

      var convertedPublic = convertPublic(publicFile);
      var convertedPrivate = convertPrivate(privateFile);
      debug('Public key converted : ' + convertedPublic);
      debug('Private key converted : ' + convertedPrivate);

      return callback(null, {
        public: convertedPublic,
        private: convertedPrivate
      });
    });
  });
}

function createCert(login, keys) {
  var cert = forge.pki.createCertificate();
  cert.publicKey = keys.public;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  var attrs = [{
    name: 'commonName',
    value: 'gitpay.org ' + login
  }, {
    name: 'countryName',
    value: 'CZ'
  }, {
    shortName: 'ST',
    value: 'Czech'
  }, {
    name: 'localityName',
    value: 'Prague'
  }, {
    name: 'organizationName',
    value: 'Gitpay'
  }, {
    shortName: 'OU',
    value: login
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true/*,
    pathLenConstraint: 4*/
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 6, // URI
      value: 'http://gitpay.org/'+ login +'#this'
    }]
  }, {
    name: 'subjectKeyIdentifier'
  }]);


  // self-sign certificate
  cert.sign(keys.private /*, forge.md.sha256.create()*/);
  debug('Certificate created');
  return cert;
}

function verifyCert (cert) {
  var caStore = forge.pki.createCaStore();
  caStore.addCertificate(cert);
  try {
    forge.pki.verifyCertificateChain(caStore, [cert], function(vfd, depth, chain) {
      if(vfd === true) {
        debug('SubjectKeyIdentifier verified: ' +
        cert.verifySubjectKeyIdentifier());
        debug('Certificate verified.');
      }
      return true;
    });
    return true;
  } catch(ex) {
    debug('Certificate verification failure: ' + JSON.stringify(ex, null, 2));
    return false;
  }
}

// If one import this file, this is a module, otherwise a library
if (require.main === module) {
    bin(process.argv);
}

module.exports = convert;
