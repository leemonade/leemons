const email = require('../src/services/email');

module.exports = {
  add: email.add,
  send: email.send,
  types: email.types,
  delete: email.delete,
  providers: email.providers,
  deleteAll: email.deleteAll,
  addProvider: email.saveProvider,
  saveProvider: email.saveProvider,
  addIfNotExist: email.addIfNotExist,
  sendAsPlatform: email.sendAsPlatform,
  sendAsEducationalCenter: email.sendAsEducationalCenter,
};
