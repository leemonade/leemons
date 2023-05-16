const _ = require('lodash');
const { table } = require('../tables');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');

async function getBasicClassesByProgram(program, { transacting } = {}) {
  const classes = await table.class.find(
    { program_$in: _.isArray(program) ? program : [program] },
    { transacting }
  );
  const classIds = _.map(classes, 'id');
  const [knowledges, substages, courses, groups] = await Promise.all([
    getKnowledgeByClass(classIds, { transacting }),
    getSubstageByClass(classIds, { transacting }),
    getCourseByClass(classIds, { transacting }),
    getGroupByClass(classIds, { transacting }),
  ]);

  const knowledgesByClass = _.groupBy(knowledges, 'class');
  const substagesByClass = _.groupBy(substages, 'class');
  const coursesByClass = _.groupBy(courses, 'class');
  const groupsByClass = _.groupBy(groups, 'class');

  return _.map(classes, ({ id, ...rest }) => ({
    id,
    ...rest,
    knowledges: knowledgesByClass[id] ? knowledgesByClass[id][0].knowledge : null,
    substages: substagesByClass[id] ? substagesByClass[id][0].substage : null,
    courses: coursesByClass[id] ? coursesByClass[id][0].course : null,
    groups: groupsByClass[id] ? groupsByClass[id][0].group : null,
  }));
}

module.exports = { getBasicClassesByProgram };
