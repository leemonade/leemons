const { registerRole } = require('./registerRole');
const { getRole } = require('./getRole');
const { listRoles } = require('./listRoles');
const { unregisterRole } = require('./unregisterRole');
const { getRoles } = require('./getRoles');

module.exports = {
  registerRole,
  getRole,
  getRoles,
  listRoles,
  unregisterRole,
};
