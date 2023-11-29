const _ = require('lodash');

async function getByClass({ class: classe, type, returnIds, ctx }) {
  const classes = _.isArray(classe) ? classe : [classe];
  const query = {
    class: _.map(classes, (c) => (_.isString(c) ? c : c.id)),
  };

  if (type) {
    query.type = type;
  }
  const classStudents = await ctx.tx.db.ClassStudent.find(query).lean();

  return returnIds ? _.uniq(_.map(classStudents, 'student')) : classStudents;
}

module.exports = { getByClass };
