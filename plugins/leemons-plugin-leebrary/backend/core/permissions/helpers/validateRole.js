const { roles } = require('../../../config/constants');

module.exports = function validateRole(role) {
  return roles.includes(role);
};
