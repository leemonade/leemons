const _ = require('lodash');
const { table } = require('../../tables');

async function getByClass(_class, { returnGroup, transacting } = {}) {
  const classGroups = await table.classGroup.find(
    { class_$in: _.isArray(_class) ? _class : [_class] },
    { transacting }
  );
  if (returnGroup) return _.map(classGroups, 'group');
  return classGroups;
}

module.exports = { getByClass };
