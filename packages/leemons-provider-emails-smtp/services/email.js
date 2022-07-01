const email = require('./private/email');
const data = require('../config/data');

module.exports = {
  data,
  saveConfig: email.saveConfig,
  getProviders: email.getProviders,
  getTransporters: email.getTransporters,
  getTransporterByConfig: email.getTransporterByConfig,
};
