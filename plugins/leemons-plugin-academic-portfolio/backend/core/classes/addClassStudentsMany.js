const _ = require('lodash');

const { validateAddClassStudentsMany } = require('../../validations/forms');

const { addClassStudents } = require('./addClassStudents');

async function addClassStudentsMany({ data, ctx }) {
  const classes = [data.class].flat();
  validateAddClassStudentsMany({ ...data, class: classes });

  return Promise.all(
    _.map(classes, (_class) =>
      addClassStudents({ data: { class: _class, students: data.students }, ctx })
    )
  );
}

module.exports = { addClassStudentsMany };
