const email = require('./private/email');
const data = require('../config/data');

module.exports = {
  data,
  addConfig: email.addConfig,
  getTransporters: email.getTransporters,
  getTransporterByConfig: email.getTransporterByConfig,
};
