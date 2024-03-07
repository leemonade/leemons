const { uniq, map } = require('lodash');

async function searchInstancesByClass({ id, ctx }) {
  const classes = await ctx.tx.db.Classes.find({
    class: id,
  })
    .select({ assignableInstance: true })
    .lean();

  return uniq(map(classes, 'assignableInstance'));
}

module.exports = { searchInstancesByClass };
