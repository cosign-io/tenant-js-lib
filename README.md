# Tenant Javascript Library


## Generate Seed

```js
> var Lib = require('./index.js'); 
> var lib = new Lib();
> lib.generateSeed();
{ secretSeed: 'rubber crew absurd market frog diary laptop frame boat danger brisk forward',
  address: '0x47244b04311eb97b381e7038a28a9e1f97c2fb7a' }
```

## Use Seed

```js
> var Lib = require('./index.js'); 
> var lib = new Lib('rubber crew absurd market frog diary laptop frame boat danger brisk forward');

> lib.getSeed();
{ secretSeed: 'rubber crew absurd market frog diary laptop frame boat danger brisk forward',
  address: '0x47244b04311eb97b381e7038a28a9e1f97c2fb7a',
  priv: '0x5bd78afc346ef2a8bda1fc0134b0d150340bceb8433a4fb7520d500482195705' }

> lib.configure('0x47244b04311eb97b381e7038a28a9e1f97c2fb7a', '0x47244b04311eb97b381e7038a28a9e1f97c2fb7a');
{ nonce: 'f28ca86d-365b-49f8-8a50-d08d6f74cae6',
  r: '0xc6bd5ae924045cdce440a9c3b961f3f2cf9f5f9f0f12bfd6f025ded15d71cf6f',
  s: '0x0ad19d4291712eb600950c922b9b646f2693104acfb04b6878e34fabffa9deef',
  v: 28 }

> lib.setup('0x47244b04311eb97b381e7038a28a9e1f97c2fb7a');
{ nonce: '3954e5da-f482-47cc-91cc-27dc8bb88a93',
  r: '0xc74aafa795bbfd6e0aa85c5f7ecc9d7110354cd3bb58c046c9014901a3ad2bc7',
  s: '0x606b4e7c22815c0ea534d3942bf52ff9d5d6d9c09999590444669651b31099dd',
  v: 28 }

> lib.recover('0x47244b04311eb97b381e7038a28a9e1f97c2fb7a', '0x47244b04311eb97b381e7038a28a9e1f97c2fb7a');
{ nonce: '4fd05b81-3a48-4404-bbad-314f3a84d480',
  r: '0xc44a5a3f868e5c80b59aa4d1858d7cb9ff559d826545f68e778bd4618fb3eb4b',
  s: '0x2e8d47696ad13d835640d5dc79784bbe9ecbc5c516c037bc955a96e20dd0711c',
  v: 28 }
  ```