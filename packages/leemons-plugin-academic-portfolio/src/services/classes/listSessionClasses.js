const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');

async function getClassesProgramInfo({ programs: _programs, classes }, { transacting }) {
  const programsIds = Array.isArray(_programs) ? _programs : [_programs];

  const subjectIds = _.uniq(_.map(classes, (classe) => classe.subject.id));

  const subjectsCredits = await table.programSubjectsCredits.find(
    {
      program_$in: programsIds,
      subject_$in: subjectIds,
    },
    { transacting }
  );

  const creditsBySubject = _.keyBy(subjectsCredits, 'subject');

  return _.map(classes, (classe) => ({
    ...classe,
    subject: { ...creditsBySubject[classe.subject.id], ...classe.subject },
  }));
}

async function listSessionClasses(
  userSession,
  { program, type, withProgram } = {},
  { withProgram: _withProgram, withTeachers, transacting } = {}
) {
  if (_withProgram) {
    // eslint-disable-next-line no-param-reassign
    withProgram = _withProgram;
  }
  let typeQuery = {};
  if (Array.isArray(type)) {
    typeQuery = {
      type_$in: type,
    };
  } else if (type) {
    typeQuery = {
      type,
    };
  } else if (type !== null) {
    typeQuery = {
      type: 'main-teacher',
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

  let classes = await classByIds(classIds, { withProgram, withTeachers, transacting });

  classes = await getClassesProgramInfo(
    {
      programs: program || _.uniq(_.map(classes, 'subject.program')),
      classes,
    },
    { transacting }
  );

  return _.orderBy(classes, ['subject.compiledInternalId', 'subject.internalId'], ['asc', 'asc']);
}

module.exports = { listSessionClasses, getClassesProgramInfo };
