const _ = require('lodash');
const { table } = require('../../tables');

async function isUsedInSubject(subject, group, { classe, transacting } = {}) {
  const classes = await table.class.find({ subject }, { columns: ['id'], transacting });
  const query = {
    class_$in: _.map(classes, 'id'),
    group,
  };
  if (classe) {
    const index = query.class_$in.indexOf(classe);
    if (index !== -1) {
      query.class_$in.splice(index, 1);
    }
  }
  const result = await table.classGroup.count(query, { transacting });
  return !!result;
}

module.exports = { isUsedInSubject };
