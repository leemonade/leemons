const _ = require('lodash');
const { table } = require('../tables');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');
const { nodesTreeByCurriculum } = require('../nodes/nodesTreeByCurriculum');

async function curriculumByIds(ids, { userSession, transacting } = {}) {
  const curriculums = await table.curriculums.find(
    { id_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  const [nodeLevels, nodes] = await Promise.all([
    nodeLevelsByCurriculum(_.map(curriculums, 'id'), { transacting }),
    nodesTreeByCurriculum(_.map(curriculums, 'id'), { userSession, transacting }),
  ]);
  const nodeLevelsByCurriculumId = _.groupBy(nodeLevels, 'curriculum');
  return _.map(curriculums, (curriculum) => ({
    ...curriculum,
    nodeLevels: nodeLevelsByCurriculumId[curriculum.id] || [],
    nodes: nodes[curriculum.id] || [],
  }));
}

module.exports = { curriculumByIds };
