const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {boolean} props.autoDeploymentID
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindByIdQuery}
 */
function findById({ model, autoDeploymentID, ctx }) {
  /**
   * @type {import('../types').FindByIdQuery}
   */
  return function (id, projection, options) {
    const query = excludeDeleteIfNeedToQuery(model.findOne({ id }, projection, options), options);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findById };
