const { filter } = require('lodash');
/**
 * Filters instances by not module.
 *
 * @param {Object} params - The filtering parameters.
 * @param {Array} params.instances - The instances to filter.
 * @param {Object} [params.filters] - The filters to apply.
 * @returns {Array} The filtered instances.
 */

function filterInstancesByNotModule({ instances, filters }) {
  if (filters?.role === 'learningpaths.module') {
    return instances;
  }

  return filter(instances, (instance) => instance.metadata?.module?.type !== 'module');
}

module.exports = { filterInstancesByNotModule };
