const _ = require('lodash');
const { table } = require('../tables');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getStudentByClass } = require('./student/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');

async function classByIds(ids, { transacting } = {}) {
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
    table.knowledges.find({ id_$in: _.map(knowledges, 'id') }, { transacting }),
    table.subjects.find({ id_$in: _.map(classes, 'subject') }, { transacting }),
    table.groups.find({ id_$in: _.map(substages, 'id') }, { transacting }),
    table.groups.find({ id_$in: _.map(courses, 'id') }, { transacting }),
    table.groups.find({ id_$in: _.map(groups, 'id') }, { transacting }),
  ]);

  const subjectTypesById = _.keyBy(originalSubjectTypes, 'id');
  const knowledgesById = _.keyBy(originalKnowledges, 'id');
  const substagesById = _.keyBy(originalSubstages, 'id');
  const subjectsById = _.keyBy(originalSubjects, 'id');
  const coursesById = _.keyBy(originalCourses, 'id');
  const groupsById = _.keyBy(originalGroups, 'id');

  const childClasses = _childClasses.length
    ? await classByIds(_.map(_childClasses, 'id'), { transacting })
    : [];

  const childClassesByClass = _.groupBy(childClasses, 'class');
  const knowledgesByClass = _.groupBy(knowledges, 'class');
  const substagesByClass = _.groupBy(substages, 'class');
  const coursesByClass = _.groupBy(courses, 'class');
  const groupsByClass = _.groupBy(groups, 'class');
  const teachersByClass = _.groupBy(teachers, 'class');
  const studentsByClass = _.groupBy(students, 'class');
  return _.map(classes, ({ id, subject, subjectType, ...rest }) => {
    let _students = studentsByClass[id] ? _.map(studentsByClass[id], 'student') : [];
    if (childClassesByClass[id]) {
      _.forEach(childClassesByClass[id], (childClass) => {
        _students = _students.concat(childClass.students);
      });
    }
    return {
      id,
      ...rest,
      subject: subjectsById[subject],
      subjectType: subjectTypesById[subjectType],
      classes: childClassesByClass[id],
      knowledges: knowledgesByClass[id] ? knowledgesById[knowledgesByClass[id][0].knowledge] : null,
      substages: substagesByClass[id] ? substagesById[substagesByClass[id][0].substage] : null,
      courses: coursesByClass[id] ? coursesById[coursesByClass[id][0].course] : null,
      groups: groupsByClass[id] ? groupsById[groupsByClass[id][0].group] : null,
      students: _.uniq(_students),
      teachers: teachersByClass[id]
        ? _.map(teachersByClass[id], ({ teacher, type }) => ({ teacher, type }))
        : [],
    };
  });
}

module.exports = { classByIds };
