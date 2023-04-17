const { table } = require('../tables');

/**
 * Create new group if name and type not in use
 * @public
 * @static
 * @param {string} name - Group name
 *  @param {string} type - Group type
 * @return {Promise<Group>} Created group
 * */
async function create({ name, type }, { transacting } = {}) {
  const group = await table.groups.findOne(
    { $or: [{ name }, { uri: global.utils.slugify(name, { lower: true }) }], type },
    { transacting }
  );
  if (group) throw new Error('There is already a group with this name and type');
  return table.groups.create({ name, type }, { transacting });
}

module.exports = { create };
