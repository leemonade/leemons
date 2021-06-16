const email = require('./private/email');

module.exports = {
  addConfig: email.addConfig,
  getTransporter: email.getTransporter,
  getTransporterByConfig: email.getTransporterByConfig,
};
