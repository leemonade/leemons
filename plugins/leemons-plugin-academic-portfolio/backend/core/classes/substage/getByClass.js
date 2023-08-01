const _ = require('lodash');

async function getByClass({ returnSubstage, class: _class, ctx }) {
  const classSubtage = await ctx.tx.db.ClassSubstage.find({
    class: _.isArray(_class) ? _class : [_class],
  }).lean();
  if (returnSubstage) return _.map(classSubtage, 'substage');
  return classSubtage;
}

module.exports = { getByClass };
