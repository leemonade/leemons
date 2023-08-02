const _ = require('lodash');

async function getByClass({ returnKnowledge, class: _class, ctx }) {
  const classKnowledges = await ctx.tx.db.ClassKnowledges.find({
    class: _.isArray(_class) ? _class : [_class],
  }).lean();
  if (returnKnowledge) return _.map(classKnowledges, 'knowledge');
  return classKnowledges;
}

module.exports = { getByClass };
