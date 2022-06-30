const email = require('./private/email');

module.exports = {
  addConfig: email.addConfig,
  getTransporters: email.getTransporters,
  getTransporterByConfig: email.getTransporterByConfig,
};
