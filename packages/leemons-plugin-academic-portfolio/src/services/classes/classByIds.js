const _ = require('lodash');
const { table } = require('../tables');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getStudentByClass } = require('./student/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');

async function classByIds(ids, { noSearchChilds, noSearchParents, transacting } = {}) {
  const [classes, knowledges, substages, courses, groups, teachers, students, _childClasses] =
    await Promise.all([
      table.class.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
      getKnowledgeByClass(ids, { transacting }),
      getSubstageByClass(ids, { transacting }),
      getCourseByClass(ids, { transacting }),
      getGroupByClass(ids, { transacting }),
      getTeacherByClass(ids, { transacting }),
      getStudentByClass(ids, { transacting }),
      table.class.find({ class_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    ]);

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
    table.subjects.find({ id_$in: _.map(classes, 'subject') }, { transacting }),
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

  if (noSearchParents) {
    const parentClassesIds = _.compact(_.map(classes, 'class'));
    parentClasses = parentClassesIds.length
      ? await classByIds(parentClassesIds, { noSearchChilds: true, transacting })
      : [];
  }

  if (noSearchChilds) {
    childClasses = _childClasses.length
      ? await classByIds(_.map(_childClasses, 'id'), { noSearchParents: true, transacting })
      : [];
  }

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
    const parentStudents = parentClassesById[id] ? getParentStudents(parentClassesById[id]) : [];

    return {
      id,
      ...rest,
      subject: subjectsById[subject],
      subjectType: subjectTypesById[subjectType],
      classes: childClassesByClass[id],
      parentClass: parentClassesById[id],
      knowledges: knowledgesByClass[id] ? knowledgesById[knowledgesByClass[id][0].knowledge] : null,
      substages: substagesByClass[id] ? substagesById[substagesByClass[id][0].substage] : null,
      courses: coursesByClass[id] ? coursesById[coursesByClass[id][0].course] : null,
      groups: groupsByClass[id] ? groupsById[groupsByClass[id][0].group] : null,
      students: _.uniq(_students),
      parentStudents: _.uniq(parentStudents),
      teachers: teachersByClass[id]
        ? _.map(teachersByClass[id], ({ teacher, type }) => ({ teacher, type }))
        : [],
    };
  });
}

module.exports = { classByIds };

/*
 *
 * clase 1 (15 alumnos) (asientos 20)
 *   ref clase 2 (2 alumnos)
 *     ref clase 3 (2 alumnos)
 *       ref clase 4 (1 alumnos)
 *       ref clase 5 (1 alumnos)
 * */
