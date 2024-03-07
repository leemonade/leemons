const _ = require('lodash');
const { getByClass: getKnowledgeByClass } = require('./knowledge/getByClass');
const { getByClass: getSubstageByClass } = require('./substage/getByClass');
const { getByClass: getCourseByClass } = require('./course/getByClass');
const { getByClass: getGroupByClass } = require('./group/getByClass');

async function getBasicClassesByProgram({ program, ctx }) {
  const classes = await ctx.tx.db.Class.find({
    program: _.isArray(program) ? program : [program],
  }).lean();
  const classIds = _.map(classes, 'id');
  const [knowledges, substages, courses, groups] = await Promise.all([
    getKnowledgeByClass({ class: classIds, ctx }),
    getSubstageByClass({ class: classIds, ctx }),
    getCourseByClass({ class: classIds, ctx }),
    getGroupByClass({ class: classIds, ctx }),
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
