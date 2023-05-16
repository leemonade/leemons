const _ = require('lodash');
const { table } = require('../tables');
const { nodesTreeByCurriculum } = require('./nodesTreeByCurriculum');
const { nodeLevelsByCurriculum } = require('../nodeLevels/nodeLevelsByCurriculum');

function reload(parent, childrens, nodeLevelsById, { transacting } = {}) {
  const promises = [];
  const listType =
    parent && nodeLevelsById[parent.nodeLevel] ? nodeLevelsById[parent.nodeLevel].listType : null;
  _.forEach(_.sortBy(childrens, 'nodeOrder'), (children, index) => {
    if (!listType) {
      promises.push(
        table.nodes.update({ id: children.id }, { fullName: children.name }, { transacting })
      );
    } else {
      switch (listType) {
        case 'style-1':
          promises.push(
            table.nodes.update(
              { id: children.id },
              { fullName: `${index + 1}. ${children.name}` },
              { transacting }
            )
          );
          break;
        case 'style-2':
          promises.push(
            table.nodes.update(
              { id: children.id },
              { fullName: `${global.utils.numberToEncodedLetter(index + 1)}. ${children.name}` },
              { transacting }
            )
          );
          break;
        default:
          promises.push(
            table.nodes.update({ id: children.id }, { fullName: children.name }, { transacting })
          );
          break;
      }
    }

    if (children.childrens) {
      promises.push(reload(children, children.childrens, nodeLevelsById, { transacting }));
    }
  });
  return Promise.all(promises);
}

async function reloadNodeFullNamesForCurriculum(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [tree, nodeLevels] = await Promise.all([
        nodesTreeByCurriculum(id, { transacting }),
        nodeLevelsByCurriculum(id, { transacting }),
      ]);
      await reload({}, tree, _.keyBy(nodeLevels, 'id'), { transacting });
    },
    table.nodes,
    _transacting
  );
}

module.exports = { reloadNodeFullNamesForCurriculum };
