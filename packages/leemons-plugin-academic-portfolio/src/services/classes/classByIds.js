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

  const childClasses = _childClasses.length
    ? await classByIds(_.map(_childClasses, 'id'), { transacting })
    : [];

  const childClassesByClass = _.groupBy(knowledges, 'class');
  const knowledgesByClass = _.groupBy(knowledges, 'class');
  const substagesByClass = _.groupBy(substages, 'class');
  const coursesByClass = _.groupBy(courses, 'class');
  const groupsByClass = _.groupBy(groups, 'class');
  const teachersByClass = _.groupBy(teachers, 'class');
  const studentsByClass = _.groupBy(students, 'class');
  return _.map(classes, ({ id, ...rest }) => {
    let _students = studentsByClass[id] ? _.map(studentsByClass[id], 'student') : [];
    if (childClassesByClass[id]) {
      _.forEach(childClassesByClass[id], (childClass) => {
        _students = _students.concat(childClass.students);
      });
    }
    return {
      id,
      ...rest,
      knowledges: knowledgesByClass[id] ? knowledgesByClass[id][0].knowledge : null,
      substages: substagesByClass[id] ? substagesByClass[id][0].substage : null,
      courses: coursesByClass[id] ? coursesByClass[id][0].course : null,
      groups: groupsByClass[id] ? groupsByClass[id][0].group : null,
      students: _.uniq(_students),
      teachers: teachersByClass[id]
        ? _.map(teachersByClass[id], ({ teacher, type }) => ({ teacher, type }))
        : [],
    };
  });
}

module.exports = { classByIds };
