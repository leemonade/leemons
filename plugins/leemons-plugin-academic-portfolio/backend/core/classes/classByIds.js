const _ = require('lodash');
const { map } = require('lodash');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getStudentByClass } = require('./student/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');
const { programHaveMultiCourses } = require('../programs/programHaveMultiCourses');
const { subjectByIds } = require('../subjects/subjectByIds');

async function classByIds({
  ids,
  withProgram,
  withTeachers,
  noSearchChilds,
  noSearchParents,
  ctx,
}) {
  const [
    classes,
    knowledges,
    substages,
    courses,
    groups,
    teachers,
    students,
    _childClasses,
    timeTables,
  ] = await Promise.all([
    ctx.tx.db.Class.find({ id: _.isArray(ids) ? ids : [ids] }),
    getKnowledgeByClass({ class: ids, ctx }),
    getSubstageByClass({ class: ids, ctx }),
    getCourseByClass({ class: ids, ctx }),
    getGroupByClass({ class: ids, ctx }),
    getTeacherByClass({ class: ids, ctx }),
    getStudentByClass({ class: ids, ctx }),
    ctx.tx.db.Class.find({ class: _.isArray(ids) ? ids : [ids] }).lean(),
    // timetableService.listByClassIds(ids, { transacting }),
    ctx.tx.call('timetable.timetable.listByClassIds', { classIds: ids }),
  ]);

  let programByIds = {};
  if (withProgram) {
    const programIds = _.uniq(_.map(classes, 'program'));
    const programs = await ctx.tx.db.Programs.find({ id: programIds }).lean();
    programByIds = _.keyBy(programs, 'id');
  }

  let teacherByIds = {};
  if (withTeachers) {
    const teacherIds = _.uniq(_.map(teachers, 'teacher'));
    const _teachers = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentsIds: teacherIds,
    });
    teacherByIds = _.keyBy(_teachers, 'id');
  }

  const images = ctx.tx.call('leebrary.assets.getByIds', {
    assetIds: _.map(classes, 'image'),
    withFiles: true,
  });

  const imagesById = _.keyBy(images, 'id');

  let classPrograms = [];
  _.forEach(classes, ({ program }) => {
    classPrograms.push(program);
  });
  classPrograms = _.uniq(classPrograms);
  const haveMultiCoursesByProgram = {};
  if (classPrograms.length) {
    const haveMultiCourses = await Promise.all(
      _.map(classPrograms, (classProgram) => programHaveMultiCourses({ id: classProgram, ctx }))
    );
    _.forEach(classPrograms, (classProgram, index) => {
      haveMultiCoursesByProgram[classProgram] = haveMultiCourses[index];
    });
  }
  const [
    originalSubjectTypes,
    originalKnowledges,
    originalSubjects,
    originalSubstages,
    originalCourses,
    originalGroups,
  ] = await Promise.all([
    ctx.tx.db.SubjectTypes.find({ id: _.map(classes, 'subjectType') }).lean(),
    ctx.tx.db.Knowledges.find({ id: _.map(knowledges, 'knowledge') }).lean(),
    subjectByIds({ ids: _.map(classes, 'subject') }),
    ctx.tx.db.Groups.find({ id: _.map(substages, 'substage') }).lean(),
    ctx.tx.db.Groups.find({ id: _.map(courses, 'course') }).lean(),
    ctx.tx.db.Groups.find({ id: _.map(groups, 'group') }).lean(),
  ]);

  const subjectTypesById = _.keyBy(originalSubjectTypes, 'id');
  const knowledgesById = _.keyBy(originalKnowledges, 'id');
  const substagesById = _.keyBy(originalSubstages, 'id');
  const subjectsById = _.keyBy(originalSubjects, 'id');
  const coursesById = _.keyBy(originalCourses, 'id');
  const groupsById = _.keyBy(originalGroups, 'id');

  let parentClasses = [];
  let childClasses = [];

  if (!noSearchParents) {
    const parentClassesIds = _.uniq(_.compact(_.map(classes, 'class')));
    parentClasses = parentClassesIds.length
      ? await classByIds({ ids: parentClassesIds, noSearchChilds: true, ctx })
      : [];
  }

  if (!noSearchChilds) {
    childClasses = _childClasses.length
      ? await classByIds({ ids: _.map(_childClasses, 'id'), noSearchParents: true, ctx })
      : [];
  }

  const timetablesByClass = _.groupBy(timeTables, 'class');
  const parentClassesById = _.keyBy(parentClasses, 'id');
  const childClassesByClass = _.groupBy(childClasses, 'class');
  const knowledgesByClass = _.groupBy(knowledges, 'class');
  const substagesByClass = _.groupBy(substages, 'class');
  const coursesByClass = _.groupBy(courses, 'class');
  const groupsByClass = _.groupBy(groups, 'class');
  const teachersByClass = _.groupBy(teachers, 'class');
  const studentsByClass = _.groupBy(students, 'class');

  const getParentStudents = (cl) => {
    let stu = cl.students;
    if (cl.parentClass) {
      stu = stu.concat(getParentStudents(cl.parentClass));
    }
    return stu;
  };

  const response = _.map(classes, ({ id, subject, subjectType, ...rest }) => {
    let _students = studentsByClass[id] ? _.map(studentsByClass[id], 'student') : [];
    if (childClassesByClass[id]) {
      _.forEach(childClassesByClass[id], (childClass) => {
        _students = _students.concat(childClass.students);
      });
    }
    const parentStudents = parentClassesById[rest.class]
      ? getParentStudents(parentClassesById[rest.class])
      : [];

    return {
      id,
      ...rest,
      program: programByIds[rest.program] ? programByIds[rest.program] : rest.program,
      subject: subjectsById[subject],
      subjectType: subjectTypesById[subjectType],
      classes: childClassesByClass[id],
      parentClass: parentClassesById[rest.class],
      image: imagesById[rest.image],
      knowledges: knowledgesByClass[id] ? knowledgesById[knowledgesByClass[id][0].knowledge] : null,
      substages: map(substagesByClass[id], ({ substage }) => substagesById[substage]),
      // eslint-disable-next-line no-nested-ternary
      courses: coursesByClass[id]
        ? haveMultiCoursesByProgram[rest.program]
          ? map(coursesByClass[id], ({ course }) => coursesById[course])
          : coursesById[coursesByClass[id][0].course]
        : null,
      groups: groupsByClass[id] ? groupsById[groupsByClass[id][0].group] : null,
      students: _.uniq(_students),
      parentStudents: _.uniq(parentStudents),
      schedule: timetablesByClass[id] ? timetablesByClass[id] : [],
      teachers: teachersByClass[id]
        ? _.map(teachersByClass[id], ({ teacher, type }) => ({
            teacher: teacherByIds[teacher] ? teacherByIds[teacher] : teacher,
            type,
          }))
        : [],
    };
  });

  return _.orderBy(response, ['subject.compiledInternalId', 'subject.internalId'], ['asc', 'asc']);
}

module.exports = { classByIds };
