const { table } = require('../tables');

/**
 * Create new group if name not in use
 * @public
 * @static
 * @param {string} name - Group name
 * @return {Promise<Group>} Created group
 * */
async function create(name) {
  const group = await table.groups.findOne({ name });
  if (group) throw new Error('There is already a group with this name');
  return table.groups.create({ name });
}

module.exports = { create };
