const email = require('../src/services/email');

module.exports = {
  send: email.send,
  types: email.types,
  addIfNotExist: email.addIfNotExist,
  add: email.add,
  delete: email.delete,
  deleteAll: email.deleteAll,
  sendAsEducationalCenter: email.sendAsEducationalCenter,
};
