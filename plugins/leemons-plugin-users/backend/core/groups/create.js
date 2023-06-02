const slugify = require('slugify');

/**
 * Create new group if name and type not in use
 * @public
 * @static
 * @param {string} name - Group name
 *  @param {string} type - Group type
 * @return {Promise<Group>} Created group
 * */
async function create({ name, type, ctx }) {
  const group = await ctx.tx.db.Groups.findOne({
    $or: [{ name }, { uri: slugify(name, { lower: true }) }],
    type,
  }).lean();
  if (group) throw new Error('There is already a group with this name and type');
  return ctx.tx.db.Groups.create({ name, type });
}

module.exports = { create };
