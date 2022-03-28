const _ = require('lodash');
const { table } = require('../tables');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');
const { curriculumByIds } = require('./curriculumByIds');

async function generateCurriculumNodesFromAcademicPortfolioByNodeLevels(
  curriculumId,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const curriculum = await table.curriculums.findOne({ id: curriculumId }, { transacting });
      if (!curriculum) throw new Error('Curriculum not found');
      const nodes = await table.nodes.count({ curriculum: curriculum.id }, { transacting });
      if (nodes) throw new Error('Curriculum already has nodes');
      const nodeLevels = await nodeLevelsByCurriculum(curriculumId, { transacting });
      // ES: Ordenamos los node levels por levelOrder
      // EN: Sort node levels by levelOrder
      const nodeLevelsOrdered = _.sortBy(nodeLevels, 'levelOrder');
      // ES: Eliminamos los nodeLevels custom ya que solo necesitamos los de academic portfolio
      // EN: Remove custom nodeLevels because we only need the ones from academic portfolio
      const nodeLevelsAcademicPortfolio = _.filter(
        nodeLevelsOrdered,
        (nodeLevel) => nodeLevel.type !== 'custom'
      );

      const types = _.map(nodeLevelsAcademicPortfolio, 'type');

      const tree = await leemons
        .getPlugin('academic-portfolio')
        .services.common.getTreeNodes(
          _.uniq(['center', 'program'].concat(types)),
          'program',
          curriculum.program,
          { transacting }
        );

      const createNodes = async (parentNode, childrens, deepLevel, levels) => {
        const results = [];
        for (let i = 0, l = childrens.length; i < l; i++) {
          if (childrens[i].nodeType !== 'class') {
            if (childrens[i].value.type === 'course') {
              // eslint-disable-next-line no-param-reassign
              childrens[i].value.name = leemons
                .getPlugin('academic-portfolio')
                .services.courses.getCourseName(childrens[i].value);
            }
            // eslint-disable-next-line no-await-in-loop
            const node = await table.nodes.create(
              {
                name:
                  childrens[i].value && childrens[i].value.name
                    ? childrens[i].value.name
                    : 'undefined',
                nodeOrder: i,
                parentNode: parentNode.id,
                nodeLevel: levels[deepLevel].id,
                curriculum: curriculum.id,
              },
              { transacting }
            );
            results.push(node);
            if (childrens[i].childrens) {
              results.push(
                // eslint-disable-next-line no-await-in-loop
                ...(await createNodes(node, childrens[i].childrens, deepLevel + 1, levels))
              );
            }
          }
        }
        return results;
      };

      if (tree.length) {
        await createNodes(
          { id: null },
          types[0] === 'program' ? tree : tree[0].childrens,
          0,
          nodeLevelsAcademicPortfolio
        );
      }
      return (await curriculumByIds(curriculum.id, { transacting }))[0];
    },
    table.curriculums,
    _transacting
  );
}

module.exports = { generateCurriculumNodesFromAcademicPortfolioByNodeLevels };
