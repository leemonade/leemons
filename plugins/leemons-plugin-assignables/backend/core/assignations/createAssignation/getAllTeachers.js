const _ = require('lodash');

function getAllTeachers({ classes, classesData }) {
  const teachers = [];
  _.forEach(classes, ({ subject: { id: subjectId } }) => {
    _.forEach(classesData, (data) => {
      if (data.subject.id === subjectId) {
        _.forEach(data.teachers, (teacher) => {
          if (teacher.type === 'main-teacher')
            teachers.push(_.isString(teacher.teacher) ? teacher.teacher : teacher.teacher.id);
        });
      }
    });
  });
  return _.uniq(teachers);
}

module.exports = { getAllTeachers };
