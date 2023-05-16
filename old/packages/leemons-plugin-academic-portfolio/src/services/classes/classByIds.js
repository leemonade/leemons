const _ = require('lodash');
const { map } = require('lodash');
const { table } = require('../tables');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getStudentByClass } = require('./student/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');
const { programHaveMultiCourses } = require('../programs/programHaveMultiCourses');
const { subjectByIds } = require('../subjects/subjectByIds');

async function classByIds(
  ids,
  { withProgram, withTeachers, userSession, noSearchChilds, noSearchParents, transacting } = {}
) {
  const timetableService = leemons.getPlugin('timetable').services.timetable;
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
    table.class.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    getKnowledgeByClass(ids, { transacting }),
    getSubstageByClass(ids, { transacting }),
    getCourseByClass(ids, { transacting }),
    getGroupByClass(ids, { transacting }),
    getTeacherByClass(ids, { transacting }),
    getStudentByClass(ids, { transacting }),
    table.class.find({ class_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    timetableService.listByClassIds(ids, { transacting }),
  ]);

  let programByIds = {};
  if (withProgram) {
    const programIds = _.uniq(_.map(classes, 'program'));
    const programs = await table.programs.find({ id_$in: programIds }, { transacting });
    programByIds = _.keyBy(programs, 'id');
  }

  let teacherByIds = {};
  if (withTeachers) {
    const teacherIds = _.uniq(_.map(teachers, 'teacher'));
    const _teachers = await leemons
      .getPlugin('users')
      .services.users.getUserAgentsInfo(teacherIds, { transacting });
    teacherByIds = _.keyBy(_teachers, 'id');
  }

  const assetService = leemons.getPlugin('leebrary').services.assets;
  const images = await assetService.getByIds(_.map(classes, 'image'), {
    withFiles: true,
    userSession,
    transacting,
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
      _.map(classPrograms, (classProgram) => programHaveMultiCourses(classProgram, { transacting }))
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
    table.subjectTypes.find({ id_$in: _.map(classes, 'subjectType') }, { transacting }),
    table.knowledges.find({ id_$in: _.map(knowledges, 'knowledge') }, { transacting }),
    subjectByIds(_.map(classes, 'subject'), { userSession, transacting }),
    table.groups.find({ id_$in: _.map(substages, 'substage') }, { transacting }),
    table.groups.find({ id_$in: _.map(courses, 'course') }, { transacting }),
    table.groups.find({ id_$in: _.map(groups, 'group') }, { transacting }),
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
      ? await classByIds(parentClassesIds, { noSearchChilds: true, transacting })
      : [];
  }

  if (!noSearchChilds) {
    childClasses = _childClasses.length
      ? await classByIds(_.map(_childClasses, 'id'), { noSearchParents: true, transacting })
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
