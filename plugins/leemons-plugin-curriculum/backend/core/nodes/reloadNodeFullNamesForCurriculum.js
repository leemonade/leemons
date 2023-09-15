const _ = require('lodash');
const { numberToEncodedLetter } = require('@leemons/utils');
const { nodesTreeByCurriculum } = require('./nodesTreeByCurriculum');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');

function reload({ parent, childrens, nodeLevelsById, ctx }) {
  const promises = [];
  const listType =
    parent && nodeLevelsById[parent.nodeLevel] ? nodeLevelsById[parent.nodeLevel].listType : null;
  _.forEach(_.sortBy(childrens, 'nodeOrder'), (children, index) => {
    if (!listType) {
      promises.push(ctx.tx.db.Nodes.updateOne({ id: children.id }, { fullName: children.name }));
    } else {
      switch (listType) {
        case 'style-1':
          promises.push(
            ctx.tx.db.Nodes.updateOne(
              { id: children.id },
              { fullName: `${index + 1}. ${children.name}` }
            )
          );
          break;
        case 'style-2':
          promises.push(
            ctx.tx.db.Nodes.updateOne(
              { id: children.id },
              { fullName: `${numberToEncodedLetter(index + 1)}. ${children.name}` }
            )
          );
          break;
        default:
          promises.push(
            ctx.tx.db.Nodes.updateOne({ id: children.id }, { fullName: children.name })
          );
          break;
      }
    }

    if (children.childrens) {
      promises.push(
        reload({ parent: children, childrens: children.childrens, nodeLevelsById, ctx })
      );
    }
  });
  return Promise.all(promises);
}

async function reloadNodeFullNamesForCurriculum({ id, ctx }) {
  const [tree, nodeLevels] = await Promise.all([
    nodesTreeByCurriculum({ id, ctx }),
    nodeLevelsByCurriculum({ ids: id, ctx }),
  ]);
  await reload({ parent: {}, childrens: tree, nodeLevelsById: _.keyBy(nodeLevels, 'id'), ctx });
}

module.exports = { reloadNodeFullNamesForCurriculum };
