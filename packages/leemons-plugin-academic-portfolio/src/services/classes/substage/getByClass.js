const _ = require('lodash');
const { table } = require('../../tables');

async function getByClass(_class, { returnSubstage, transacting } = {}) {
  const classSubtage = await table.classSubstage.find(
    { class_$in: _.isArray(_class) ? _class : [_class] },
    { transacting }
  );
  if (returnSubstage) return _.map(classSubtage, 'substage');
  return classSubtage;
}

module.exports = { getByClass };
