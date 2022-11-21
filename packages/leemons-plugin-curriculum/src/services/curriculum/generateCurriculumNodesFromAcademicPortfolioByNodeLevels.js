/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const {table} = require('../tables');
const {nodeLevelsByCurriculum} = require('../nodeLevels/nodeLevelsByCurriculum');
const {curriculumByIds} = require('./curriculumByIds');

async function generateCurriculumNodesFromAcademicPortfolioByNodeLevels(
  curriculumId,
  {transacting: _transacting} = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const curriculum = await table.curriculums.findOne({id: curriculumId}, {transacting});
      if (!curriculum) throw new Error('Curriculum not found');

      if (curriculum.step === 2) {
        await table.curriculums.update({id: curriculumId}, {step: 3}, {transacting});
      }

      const nodeLevels = await nodeLevelsByCurriculum(curriculumId, {transacting});
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

      const [tree, currentNodes] = await Promise.all([
        leemons
          .getPlugin('academic-portfolio')
          .services.common.getTreeNodes(
          _.uniq(['center', 'program'].concat(types)),
          'program',
          curriculum.program,
          {transacting}
        ),
        table.nodes.find({curriculum: curriculum.id}, {columns: ['id', 'treeId'], transacting}),
      ]);

      const currentTreeIds = _.map(currentNodes, 'treeId');
      const treeIds = [];

      let child;
      const createNodes = async (parentNode, childrens, deepLevel, levels) => {
        for (let i = 0, l = childrens.length; i < l; i++) {
          child = childrens[i];
          if (child.nodeType !== 'class') {
            if (child.value.type === 'course') {
              // eslint-disable-next-line no-param-reassign
              child.value.name = leemons
                .getPlugin('academic-portfolio')
                .services.courses.getCourseName(child.value);
            }

            let node = null;
            if (currentTreeIds.includes(child.treeId)) {
              if (child.childrens && child.childrens.length) {
                treeIds.push(child.treeId);
                node = await table.nodes.update(
                  {treeId: child.treeId},
                  {name: child.value && child.value.name ? child.value.name : 'undefined'},
                  {transacting}
                );
              }
            } else if (child.childrens && child.childrens.length) {
              treeIds.push(child.treeId);
              node = await table.nodes.create(
                {
                  name: child.value && child.value.name ? child.value.name : 'undefined',
                  nodeOrder: i,
                  academicItem: child.value && child.value.id ? child.value.id : null,
                  parentNode: parentNode.id,
                  nodeLevel: levels[deepLevel].id,
                  curriculum: curriculum.id,
                  treeId: child.treeId,
                },
                {transacting}
              );
            }
            if (child.childrens) {
              await createNodes(node, child.childrens, deepLevel + 1, levels);
            }
          }
        }
      };

      if (tree.length) {
        await createNodes(
          {id: null},
          types[0] === 'program' ? tree : tree[0].childrens,
          0,
          nodeLevelsAcademicPortfolio
        );
        const treeIdsToRemove = _.filter(currentTreeIds, (id) => !treeIds.includes(id));
        if (treeIdsToRemove.length) {
          await table.nodes.deleteMany({treeId_$in: treeIdsToRemove}, {transacting});
        }
      }
      return (await curriculumByIds(curriculum.id, {transacting}))[0];
    },
    table.curriculums,
    _transacting
  );
}

module.exports = {generateCurriculumNodesFromAcademicPortfolioByNodeLevels};
