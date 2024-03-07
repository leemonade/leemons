const _ = require('lodash');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');
const { nodesTreeByCurriculum } = require('../nodes/nodesTreeByCurriculum');

async function curriculumByIds({ ids, withProgram, ctx }) {
  const curriculums = await ctx.tx.db.Curriculums.find({ id: _.isArray(ids) ? ids : [ids] }).lean();
  const promises = [
    nodeLevelsByCurriculum({ ids: _.map(curriculums, 'id'), ctx }),
    nodesTreeByCurriculum({ id: _.map(curriculums, 'id'), ctx }),
  ];
  if (withProgram) {
    promises.push(
      ctx.tx.call('academic-portfolio.programs.programsByIds', {
        ids: _.map(curriculums, 'program'),
      })
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
