const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');

async function listSessionClasses(userSession, { program, type } = {}, { transacting } = {}) {
  let typeQuery = {};
  if (Array.isArray(type)) {
    typeQuery = {
      type_$in: type,
    };
  } else if (type) {
    typeQuery = {
      type,
    };
  }
  const [classStudent, classTeacher] = await Promise.all([
    table.classStudent.find(
      { student_$in: _.map(userSession.userAgents, 'id') },
      { columns: ['class'], transacting }
    ),
    table.classTeacher.find(
      { teacher_$in: _.map(userSession.userAgents, 'id'), ...typeQuery },
      { columns: ['class', 'type'], transacting }
    ),
  ]);

  let classIds = _.map(classStudent, 'class').concat(_.map(classTeacher, 'class'));
  if (program) {
    const programClasses = await table.class.find(
      { program, id_$in: classIds },
      { columns: ['id'], transacting }
    );
    classIds = _.map(programClasses, 'id');
  }

  const classes = await classByIds(classIds, { transacting });

  if (program) {
    const subjectIds = _.uniq(_.map(classes, (classe) => classe.subject.id));
    const subjectCredits = await table.programSubjectsCredits.find(
      {
        program,
        subject_$in: subjectIds,
      },
      { transacting }
    );
    const creditsBySubject = _.keyBy(subjectCredits, 'subject');
    _.forEach(classes, (classe) => {
      // eslint-disable-next-line no-param-reassign
      classe.subject = { ...classe.subject, ...creditsBySubject[classe.subject.id] };
    });
  }

  return classes;
}

module.exports = { listSessionClasses };
