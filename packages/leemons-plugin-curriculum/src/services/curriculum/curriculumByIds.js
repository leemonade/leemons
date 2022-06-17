const _ = require('lodash');
const { table } = require('../tables');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');
const { nodesTreeByCurriculum } = require('../nodes/nodesTreeByCurriculum');

async function curriculumByIds(ids, { userSession, withProgram, transacting } = {}) {
  const curriculums = await table.curriculums.find(
    { id_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  const promises = [
    nodeLevelsByCurriculum(_.map(curriculums, 'id'), { transacting }),
    nodesTreeByCurriculum(_.map(curriculums, 'id'), { userSession, transacting }),
  ];
  if (withProgram) {
    promises.push(
      leemons
        .getPlugin('academic-portfolio')
        .services.programs.programsByIds(_.map(curriculums, 'program'), { transacting })
    );
  }

  const [nodeLevels, nodes, programs] = await Promise.all(promises);

  const programsByIds = _.keyBy(programs, 'id');

  const nodeLevelsByCurriculumId = _.groupBy(nodeLevels, 'curriculum');
  return _.map(curriculums, (curriculum) => ({
    ...curriculum,
    nodeLevels: nodeLevelsByCurriculumId[curriculum.id] || [],
    nodes: nodes[curriculum.id] || [],
    program: withProgram ? programsByIds[curriculum.program] : curriculum.program,
  }));
}

module.exports = { curriculumByIds };
