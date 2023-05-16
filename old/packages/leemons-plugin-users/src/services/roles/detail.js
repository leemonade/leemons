const { table } = require('../tables');

async function detail(id, { transacting } = {}) {
  const role = await table.roles.findOne({ id }, { transacting });
  if (!role) throw new global.utils.HttpError(404, `No role found with id '${id}'`);
  role.permissions = await table.rolePermission.find({ role: role.id }, { transacting });
  return role;
}

module.exports = { detail };
