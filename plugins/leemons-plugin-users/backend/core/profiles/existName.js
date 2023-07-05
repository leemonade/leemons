const slugify = require('slugify');

async function existName({ name, id, ctx }) {
  const query = {
    $or: [{ name }, { uri: slugify(name, { lower: true }) }],
  };
  if (id) {
    query.id = {
      $ne: id,
    };
  }
  const response = await ctx.tx.db.Profiles.countDocuments(query);
  return !!response;
}

module.exports = { existName };
