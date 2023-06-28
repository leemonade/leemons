const slugify = require('slugify');

async function existName({ name, _id, ctx }) {
  const query = {
    $or: [{ name }, { uri: slugify(name, { lower: true }) }],
  };
  if (_id) {
    query._id = {
      $ne: _id,
    };
  }
  const response = await ctx.tx.db.Profiles.countDocuments(query);
  return !!response;
}

module.exports = { existName };
