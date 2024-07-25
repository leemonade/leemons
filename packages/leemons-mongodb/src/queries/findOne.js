const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {boolean} props.autoDeploymentID
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindOneQuery}
 */
function findOne({ model, autoDeploymentID, ctx }) {
  /**
   * @type {import('../types').FindOneQuery}
   */
  return function (conditions = {}, projection, options) {
    const query = excludeDeleteIfNeedToQuery(
      model.findOne(conditions, projection, options),
      options
    );
    if (autoDeploymentID && !options?.disableAutoDeploy)
      return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findOne };
