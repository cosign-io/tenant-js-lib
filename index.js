var uuid = require('node-uuid');
var ethUtil = require('ethereumjs-util');
const wallet = require('eth-lightwallet');

const pwDerivedKey = new Uint8Array([215,152,86,175,5,168,43,177,135,97,218,89,136,5,110,93,193,114,94,197,247,212,127,83,200,150,255,124,17,245,91,10]);

function Tenant(secret) {
  if (secret && secret.length > 70) {
    this.ks = new wallet.keystore(secret, pwDerivedKey);
    this.ks.generateNewAddress(pwDerivedKey, 1);
  } else if (secret) {
    this.ks = new wallet.keystore();
    this.ks.addPriv = function(privkeyHex) {
      var privKey = new Buffer(privkeyHex.replace('0x',''), 'hex');
      var encPrivKey = wallet.keystore._encryptKey(privKey, pwDerivedKey);
      var address = wallet.keystore._computeAddressFromPrivKey(privKey);
      this.ksData["m/0'/0'/0'"].encPrivKeys[address] = encPrivKey;
      this.ksData["m/0'/0'/0'"].addresses.push(address);
    };
    this.ks.isDerivedKeyCorrect = function(pwDerivedKey) {
      if (!this.encSeed)
        return true;
      var paddedSeed = KeyStore._decryptString(this.encSeed, pwDerivedKey);
      if (paddedSeed.length > 0) {
        return true;
      }
      return false;
    };
    this.ks.addPriv(secret);
  }
}

Tenant.prototype.generateSeed = function() {
  var secretSeed = wallet.keystore.generateRandomSeed();
  this.ks = new wallet.keystore(secretSeed, pwDerivedKey);
  this.ks.generateNewAddress(pwDerivedKey, 1);
  return {
    secretSeed: secretSeed,
    address: '0x'+this.ks.getAddresses()[0]
  }
}

Tenant.prototype.getSeed = function() {
  var address = this.ks.getAddresses()[0];
  var rv = {
    address: '0x' + address,
    priv: '0x' + this.ks.exportPrivateKey(address, pwDerivedKey)
  };
  if (this.ks.encSeed) {
    console.log('here');
    rv.secretSeed = this.ks.getSeed(pwDerivedKey);
  }
  return rv;
}

Tenant.prototype.configure = function(ten, dest) {
  var nonceBuffer = new Buffer(32);
  nonceBuffer.fill(0);
  uuid.v4(null, nonceBuffer, 16);

  var signerKey = this.ks.exportPrivateKey(this.ks.getAddresses()[0], pwDerivedKey);
  var priv = new Buffer(signerKey, 'hex');
  var tenant = new Buffer(ten.replace('0x',''), 'hex');
  var callDest = new Buffer(dest.replace('0x',''), 'hex');

  var hash = ethUtil.sha3( Buffer.concat([tenant, callDest, nonceBuffer]));

  var sig = ethUtil.ecsign(hash, priv);
  console.log(sig.toString('hex'));

  return {
    nonce: uuid.unparse(nonceBuffer, 16),
    r: '0x' + sig.r.toString('hex'),
    s: '0x' + sig.s.toString('hex'),
    v: sig.v
  };
};

Tenant.prototype.setup = function(userAddress) {
  var nonceBuffer = new Buffer(32);
  nonceBuffer.fill(0);
  uuid.v4(null, nonceBuffer, 16);

  var signerKey = this.ks.exportPrivateKey(this.ks.getAddresses()[0], pwDerivedKey);
  var priv = new Buffer(signerKey, 'hex');
  var addr = new Buffer(userAddress.replace('0x',''), 'hex');

  var hash = ethUtil.sha3( Buffer.concat([addr, nonceBuffer]));

  var sig = ethUtil.ecsign(hash, priv);
  return {
    nonce: uuid.unparse(nonceBuffer, 16),
    r: '0x' + sig.r.toString('hex'),
    s: '0x' + sig.s.toString('hex'),
    v: sig.v
  };
}

Tenant.prototype.recover = function(oldAddr, newAddr) {
  var nonceBuffer = new Buffer(32);
  nonceBuffer.fill(0);
  uuid.v4(null, nonceBuffer, 16);

  var signerKey = this.ks.exportPrivateKey(this.ks.getAddresses()[0], pwDerivedKey);
  var priv = new Buffer(signerKey, 'hex');
  var oldAddr = new Buffer(oldAddr.replace('0x',''), 'hex');
  var newAddr = new Buffer(newAddr.replace('0x',''), 'hex');

  var hash = ethUtil.sha3( Buffer.concat([oldAddr, newAddr, nonceBuffer]));

  var sig = ethUtil.ecsign(hash, priv);
  return {
    nonce: uuid.unparse(nonceBuffer, 16),
    r: '0x' + sig.r.toString('hex'),
    s: '0x' + sig.s.toString('hex'),
    v: sig.v
  };
};


module.exports = Tenant;