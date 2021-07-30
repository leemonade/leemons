const _ = require('lodash');
const constants = require('../../../config/constants');
const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');
const recoverEmail = require('../../../emails/recoverPassword');
const resetPassword = require('../../../emails/resetPassword');

async function init() {
  await generateJWTPrivateKey();
}

module.exports = { init };
