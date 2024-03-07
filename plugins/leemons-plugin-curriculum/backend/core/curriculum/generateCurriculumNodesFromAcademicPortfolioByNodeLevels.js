/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getCourseName } = require('@leemons/academic-portfolio');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');
const { curriculumByIds } = require('./curriculumByIds');

async function generateCurriculumNodesFromAcademicPortfolioByNodeLevels({ curriculumId, ctx }) {
  const curriculum = await ctx.tx.db.Curriculums.findOne({ id: curriculumId }).lean();
  if (!curriculum) throw new LeemonsError(ctx, { message: 'Curriculum not found' });

  if (curriculum.step === 2) {
    await ctx.tx.db.Curriculums.updateOne({ id: curriculumId }, { step: 3 });
  }

  const nodeLevels = await nodeLevelsByCurriculum({ ids: curriculumId, ctx });
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
    ctx.tx.call('academic-portfolio.common.getTreeNodes', {
      nodeTypes: _.uniq(['center', 'program'].concat(types)),
      nodeType: 'program',
      nodeId: curriculum.program,
      program: curriculum.program,
    }),
    ctx.tx.db.Nodes.find({ curriculum: curriculum.id }).select(['id', 'treeId']).lean(),
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
          child.value.name = getCourseName(child.value);
        }

        let node = null;
        if (currentTreeIds.includes(child.treeId)) {
          if (child.childrens && child.childrens.length) {
            treeIds.push(child.treeId);
            node = await ctx.tx.db.Nodes.findOneAndUpdate(
              { treeId: child.treeId },
              { name: child.value && child.value.name ? child.value.name : 'undefined' },
              { lean: true, new: true }
            );
          }
        } else if (child.childrens && child.childrens.length) {
          treeIds.push(child.treeId);
          node = await ctx.tx.db.Nodes.create({
            name: child.value && child.value.name ? child.value.name : 'undefined',
            nodeOrder: i,
            academicItem: child.value && child.value.id ? child.value.id : null,
            parentNode: parentNode.id,
            nodeLevel: levels[deepLevel].id,
            curriculum: curriculum.id,
            treeId: child.treeId,
          });
          node = node.toObject();
        }
        if (child.childrens) {
          await createNodes(node, child.childrens, deepLevel + 1, levels);
        }
      }
    }
  };

  if (tree.length) {
    await createNodes(
      { id: null },
      types[0] === 'program' ? tree : tree[0].childrens,
      0,
      nodeLevelsAcademicPortfolio
    );
    const treeIdsToRemove = _.filter(currentTreeIds, (id) => !treeIds.includes(id));
    if (treeIdsToRemove.length) {
      await ctx.tx.db.Nodes.deleteMany({ treeId: treeIdsToRemove });
    }
  }
  return (await curriculumByIds({ ids: curriculum.id, ctx }))[0];
}

module.exports = { generateCurriculumNodesFromAcademicPortfolioByNodeLevels };
