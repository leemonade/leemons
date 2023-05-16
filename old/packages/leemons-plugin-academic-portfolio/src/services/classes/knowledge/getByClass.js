const _ = require('lodash');
const { table } = require('../../tables');

async function getByClass(_class, { returnKnowledge, transacting } = {}) {
  const classKnowledges = await table.classKnowledges.find(
    { class_$in: _.isArray(_class) ? _class : [_class] },
    { transacting }
  );
  if (returnKnowledge) return _.map(classKnowledges, 'knowledge');
  return classKnowledges;
}

module.exports = { getByClass };
