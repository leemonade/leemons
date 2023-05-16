const _ = require('lodash');
const { table } = require('../tables');

module.exports = async function listByClassIds(classIds, { transacting } = {}) {
  return table.timetable.find(
    {
      class_$in: _.isArray(classIds) ? classIds : [classIds],
    },
    { transacting }
  );
};
