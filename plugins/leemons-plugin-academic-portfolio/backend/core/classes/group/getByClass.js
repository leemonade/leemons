const _ = require('lodash');

async function getByClass({ returnGroup, class: _class, ctx }) {
  const classGroups = await ctx.tx.db.ClassGroup.find({
    class: _.isArray(_class) ? _class : [_class],
  }).lean();
  if (returnGroup) return _.map(classGroups, 'group');
  return classGroups;
}

module.exports = { getByClass };
