const _ = require('lodash');

module.exports = async function listByClassIds({ classIds, ctx }) {
  return ctx.tx.db.Timetable.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
};
