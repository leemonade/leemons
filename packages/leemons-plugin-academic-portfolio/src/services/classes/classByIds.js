const _ = require('lodash');
const { table } = require('../tables');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getTeacherByClass } = require('./teacher/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');

async function classByIds(ids, { transacting } = {}) {
  const [classes, knowledges, substages, courses, groups, teachers] = await Promise.all([
    table.class.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    getKnowledgeByClass(ids, { transacting }),
    getSubstageByClass(ids, { transacting }),
    getCourseByClass(ids, { transacting }),
    getGroupByClass(ids, { transacting }),
    getTeacherByClass(ids, { transacting }),
  ]);
  const knowledgesByClass = _.groupBy(knowledges, 'class');
  const substagesByClass = _.groupBy(substages, 'class');
  const coursesByClass = _.groupBy(courses, 'class');
  const groupsByClass = _.groupBy(groups, 'class');
  const teachersByClass = _.groupBy(teachers, 'class');
  return _.map(classes, ({ id, ...rest }) => ({
    id,
    ...rest,
    knowledges: knowledgesByClass[id] ? knowledgesByClass[id][0].knowledge : null,
    substages: substagesByClass[id] ? substagesByClass[id][0].substage : null,
    courses: coursesByClass[id] ? coursesByClass[id][0].course : null,
    groups: groupsByClass[id] ? groupsByClass[id][0].groups : null,
    teachers: teachersByClass[id]
      ? _.map(teachersByClass[id], ({ teacher, type }) => ({ teacher, type }))
      : [],
  }));
}

module.exports = { classByIds };
