const _ = require('lodash');
const { validateAddClassTeachersMany } = require('../../validations/forms');
const { addClassTeachers } = require('./addClassTeachers');

async function addClassTeachersMany({ data, ctx }) {
  const classes = _.isArray(data.class) ? data.class : [data.class];
  await validateAddClassTeachersMany({ class: classes, ...data });
  return Promise.all(
    _.map(classes, (_class) =>
      addClassTeachers({ data: { class: _class, teachers: data.teachers }, ctx })
    )
  );
}

module.exports = { addClassTeachersMany };
