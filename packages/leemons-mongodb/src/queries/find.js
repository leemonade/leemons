const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

/**
 *
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {boolean} props.autoDeploymentID
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindQuery}
 */
function find({ model, autoDeploymentID, ctx }) {
  /**
   * @type {import('../types').FindQuery}
   */
  return function (conditions = {}, projection, options) {
    const query = excludeDeleteIfNeedToQuery(model.find(conditions, projection, options), options);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { find };
