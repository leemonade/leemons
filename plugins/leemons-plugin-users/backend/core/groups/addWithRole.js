const slugify = require('slugify');
const { LeemonsError } = require('leemons-error');
const { add } = require('../roles');
/**
 * Create new group if name and type not in use
 * @public
 * @static
 * @param {string} name - Group name
 *  @param {string} type - Group type
 * @return {Promise<Group>} Created group
 * */
async function addWithRole({ name, description, permissions, indexable, ctx }) {
  let group = await ctx.tx.db.Groups.findOne({
    $or: [{ name }, { uri: slugify(name, { lower: true }) }],
    type: 'role',
  }).lean();
  if (group)
    throw new LeemonsError(ctx, { message: 'There is already a group with this name and type' });

  group = await ctx.tx.db.Groups.create({
    name,
    type: 'role',
    description,
    uri: slugify(name, { lower: true }),
    indexable,
  });
  group = group.toObject();

  const role = await add({
    name: `group:${group.id}:role`,
    type: ctx.prefixPN('group-role'),
    permissions,
    ctx,
  });

  await ctx.tx.db.GroupRole.create({ group: group.id, role: role.id });

  return group;
}

module.exports = { addWithRole };
