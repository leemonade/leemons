const { filter } = require('lodash');

function filterInstancesByNotModule({ instances, filters }) {
  if (filters?.role === 'learningpaths.module') {
    return instances;
  }

  return filter(instances, (instance) => instance.metadata?.module?.type !== 'module');
}

module.exports = { filterInstancesByNotModule };
