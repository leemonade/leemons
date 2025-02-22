const _ = require('lodash');
const { map } = require('lodash');

const { programHasSequentialCourses } = require('../programs/programHasSequentialCourses');
const { subjectByIds } = require('../subjects/subjectByIds');

const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getStudentByClass } = require('./student/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');

function manageClassCourses(
  id,
  coursesByClass,
  coursesById,
  multipleCoursesAllowedByProgram,
  program
) {
  if (!coursesByClass[id]) return null;

  if (multipleCoursesAllowedByProgram[program]) {
    return coursesByClass[id].map(({ course }) => coursesById[course]);
  }
  return coursesById[coursesByClass[id][0].course];
}

async function classByIds({
  ids,
  withProgram,
  withTeachers,
  noSearchChildren,
  noSearchParents,
  showArchived = false,
  ctx,
}) {
  const queryOptions = showArchived ? { excludeDeleted: false } : {};
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
    customPeriods,
  ] = await Promise.all([
    ctx.tx.db.Class.find({ id: _.isArray(ids) ? ids : [ids] }, '', queryOptions).lean(),
    getKnowledgeByClass({ class: ids, ctx }),
    getSubstageByClass({ class: ids, ctx }),
    getCourseByClass({ class: ids, showArchived, ctx }),
    getGroupByClass({ class: ids, ctx }),
    getTeacherByClass({ class: ids, ctx }),
    getStudentByClass({ class: ids, ctx }),
    ctx.tx.db.Class.find({ class: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.call('timetable.timetable.listByClassIds', { classIds: ids }),
    ctx.tx.call('academic-calendar.custom-period.getByItems', { items: ids }),
  ]);

  let programByIds = {};
  if (withProgram) {
    const { programsByIds: getProgramsByIds } = require('../programs/programsByIds');

    const programIds = _.uniq(_.map(classes, 'program'));
    const programs = (await getProgramsByIds({ ids: programIds, ctx })).map((p) => ({
      ...p,
      // Return only the id of the image due to legacy behavior
      image: p.image ? p.image.id : null,
    }));
    programByIds = _.keyBy(programs, 'id');
  }

  let teacherByIds = {};
  if (withTeachers) {
    const teacherIds = _.uniq(_.map(teachers, 'teacher'));
    const _teachers = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: teacherIds,
    });
    teacherByIds = _.keyBy(_teachers, 'id');
  }

  const images = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: _.map(classes, 'image'),
    withFiles: true,
  });

  const imagesById = _.keyBy(images, 'id');

  let classPrograms = [];
  _.forEach(classes, ({ program }) => {
    classPrograms.push(program);
  });
  classPrograms = _.uniq(classPrograms);
  const multipleCoursesAllowedByProgram = {};
  if (classPrograms.length) {
    const programCoursesAreSequential = await Promise.all(
      _.map(classPrograms, (classProgram) => programHasSequentialCourses({ id: classProgram, ctx }))
    );
    _.forEach(classPrograms, (classProgram, index) => {
      multipleCoursesAllowedByProgram[classProgram] = !programCoursesAreSequential[index];
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
    ctx.tx.db.KnowledgeAreas.find({ id: _.map(knowledges, 'knowledge') }).lean(),
    subjectByIds({ ids: _.map(classes, 'subject'), showArchived, ctx }),
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
      ? await classByIds({ ids: parentClassesIds, noSearchChildren: true, ctx })
      : [];
  }

  if (!noSearchChildren) {
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

  return _.map(classes, ({ id, subject, subjectType, ...rest }) => {
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
      courses: manageClassCourses(
        id,
        coursesByClass,
        coursesById,
        multipleCoursesAllowedByProgram,
        rest.program
      ),
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
      customPeriod: !_.isEmpty(customPeriods[id])
        ? {
            startDate: customPeriods[id].startDate,
            endDate: customPeriods[id].endDate,
          }
        : undefined,
    };
  });
}

module.exports = { classByIds };
