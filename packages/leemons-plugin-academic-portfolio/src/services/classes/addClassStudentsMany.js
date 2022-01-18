const _ = require('lodash');
const { table } = require('../tables');
const { validateAddClassStudentsMany } = require('../../validations/forms');
const { addClassStudents } = require('./addClassStudents');

async function addClassStudentsMany(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = _.isArray(data.class) ? data.class : [data.class];
      await validateAddClassStudentsMany({ ...data, class: classes }, { transacting });
      return Promise.all(
        _.map(classes, (_class) =>
          addClassStudents({ class: _class, students: data.students }, { transacting })
        )
      );
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClassStudentsMany };
