const _ = require('lodash');

const { classByIds } = require('./classByIds');

async function getClassesProgramInfo({ programs: _programs, classes, ctx }) {
  const programsIds = Array.isArray(_programs) ? _programs : [_programs];

  const subjectIds = _.uniq(_.map(classes, (classe) => classe.subject.id));

  const subjectsCredits = await ctx.tx.db.ProgramSubjectsCredits.find({
    program: programsIds,
    subject: subjectIds,
  }).lean();

  const creditsBySubject = _.keyBy(subjectsCredits, 'subject');

  return _.map(classes, (classe) => ({
    ...classe,
    subject: { ...creditsBySubject[classe.subject.id], ...classe.subject },
  }));
}

async function listSessionClasses({ program, type, withProgram, withTeachers, ctx }) {
  const { userSession } = ctx.meta;

  let typeQuery = {};
  if (type) {
    typeQuery = {
      type,
    };
  } else if (type !== null) {
    typeQuery = {
      type: ['main-teacher', 'associate-teacher'],
    };
  }
  const [classStudent, classTeacher] = await Promise.all([
    ctx.tx.db.ClassStudent.find({ student: _.map(userSession.userAgents, 'id') })
      .select(['class'])
      .lean(),
    ctx.tx.db.ClassTeacher.find({ teacher: _.map(userSession.userAgents, 'id'), ...typeQuery })
      .select(['class', 'type'])
      .lean(),
  ]);

  let classIds = _.map(classStudent, 'class').concat(_.map(classTeacher, 'class'));
  if (program) {
    const programClasses = await ctx.tx.db.Class.find({ program, id: classIds })
      .select(['id'])
      .lean();
    classIds = _.map(programClasses, 'id');
  }

  let classes = await classByIds({ ids: classIds, withProgram, withTeachers, ctx });

  classes = await getClassesProgramInfo({
    programs: program || _.uniq(_.map(classes, 'subject.program')),
    classes,
    ctx,
  });

  return classes;
}

module.exports = { listSessionClasses, getClassesProgramInfo };
