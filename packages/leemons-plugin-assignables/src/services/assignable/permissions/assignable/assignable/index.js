const registerPermission = require('./registerPermission');
const removePermission = require('./removePermission');

module.exports = {
  registerAssignablePermission: registerPermission,
  removeAssignablePermission: removePermission,
};
