const _ = require('lodash');
const { table } = require('../tables');

async function getNodeValues(node, userSession, { transacting } = {}) {
  try {
    return {
      id: node.id,
      values: await leemons
        .getPlugin('dataset')
        .services.dataset.getValues(
          `node-level-${node.nodeLevel}`,
          'plugins.curriculum',
          userSession?.userAgents,
          { target: node.id, transacting }
        ),
    };
  } catch (e) {
    return {
      id: node.id,
      values: null,
    };
  }
}

/*
async function nodesTreeByCurriculum(id, { userSession, transacting } = {}) {
  const ids = _.isArray(id) ? id : [id];
  const nodes = await table.nodes.find({ curriculum_$in: ids }, { transacting });

  const values = await Promise.all(
    _.map(nodes, (node) => getNodeValues(node, userSession, { transacting }))
  );
  const valuesById = _.keyBy(values, 'id');
  _.forEach(nodes, (node) => {
    // eslint-disable-next-line no-param-reassign
    node.formValues = valuesById[node.id].values;
  });

  const nodesByParent = _.groupBy(nodes, 'parentNode');
  _.forEach(nodes, (node) => {
    // eslint-disable-next-line no-param-reassign
    node.childrens = nodesByParent[node.id]
      ? _.orderBy(nodesByParent[node.id], ['nodeOrder'], ['asc'])
      : [];
  });

  const group = _.groupBy(nodesByParent.null, 'curriculum');

  _.forIn(group, (g, key) => {
    group[key] = _.orderBy(g, ['nodeOrder'], ['asc']);
  });

  return _.isArray(id) ? group : group[id];
}

 */

async function nodesTreeByCurriculum(id, { transacting } = {}) {
  const ids = _.isArray(id) ? id : [id];
  const nodes = await table.nodes.find({ curriculum_$in: ids }, { transacting });

  _.forEach(nodes, (node) => {
    // eslint-disable-next-line no-param-reassign
    node.formValues = node.data ? JSON.parse(node.data) : null;
  });

  const nodesByParent = _.groupBy(nodes, 'parentNode');
  _.forEach(nodes, (node) => {
    // eslint-disable-next-line no-param-reassign
    node.childrens = nodesByParent[node.id]
      ? _.orderBy(nodesByParent[node.id], ['nodeOrder'], ['asc'])
      : [];
  });

  const group = _.groupBy(nodesByParent.null, 'curriculum');

  _.forIn(group, (g, key) => {
    group[key] = _.orderBy(g, ['nodeOrder'], ['asc']);
  });

  return _.isArray(id) ? group : group[id];
}

module.exports = { nodesTreeByCurriculum, getNodeValues };
