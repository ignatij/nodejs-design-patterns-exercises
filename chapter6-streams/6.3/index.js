'use strict'
const crypto = require('crypto')
console.log(crypto.randomUUID().slice(0, 24))
// write this to a secret file