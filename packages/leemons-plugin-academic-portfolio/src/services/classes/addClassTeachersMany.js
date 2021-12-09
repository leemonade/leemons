const _ = require('lodash');
const { table } = require('../tables');
const { validateAddClassTeachersMany } = require('../../validations/forms');
const { addClassTeachers } = require('./addClassTeachers');

async function addClassTeachersMany(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = _.isArray(data.class) ? data.class : [data.class];
      await validateAddClassTeachersMany({ class: classes, ...data }, { transacting });
      return Promise.all(
        _.map(classes, (_class) =>
          addClassTeachers({ class: _class, teachers: data.teachers }, { transacting })
        )
      );
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClassTeachersMany };
