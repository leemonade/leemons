const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {boolean} props.autoDeploymentID
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').CountDocumentsQuery}
 */
function countDocuments({ model, autoDeploymentID, ctx }) {
  /**
   * @type {import('../types').CountDocumentsQuery}
   */
  return function (_conditions = {}, options, ...args) {
    let conditions = _conditions;
    if (autoDeploymentID) conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    return excludeDeleteIfNeedToQuery(model.countDocuments(conditions, options, ...args), options);
  };
}

module.exports = { countDocuments };
