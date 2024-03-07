const _ = require('lodash');
const { validateAddClassStudentsMany } = require('../../validations/forms');
const { addClassStudents } = require('./addClassStudents');

async function addClassStudentsMany({ data, ctx }) {
  const classes = _.isArray(data.class) ? data.class : [data.class];
  await validateAddClassStudentsMany({ ...data, class: classes });
  return Promise.all(
    _.map(classes, (_class) =>
      addClassStudents({ data: { class: _class, students: data.students }, ctx })
    )
  );
}

module.exports = { addClassStudentsMany };
