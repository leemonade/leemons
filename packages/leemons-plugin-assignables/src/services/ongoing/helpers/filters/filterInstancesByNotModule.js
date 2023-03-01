const { filter } = require('lodash');

function filterInstancesByNotModule({ instances }) {
  return filter(instances, (instance) => instance.metadata?.module?.type !== 'module');
}

module.exports = { filterInstancesByNotModule };
