const email = require('./private/email');

module.exports = {
  send: email.send,
  types: email.types,
};
