/**
 * Executes a custom call to a broker with the provided parameters.
 *
 * @param {Object} params - The parameters for the custom call.
 * @param {Object} params.broker - The broker to make the call to.
 * @param {string} params.caller - The caller of the call.
 * @param {string} params.actionName - The name of the action to call.
 * @param {string} params.deploymentId - The deployment ID.
 * @param {Object} [params.payload={}] - The payload to send with the call.
 * @returns {Promise<Object>} The result of the broker call.
 */
const customCall = async ({ broker, caller, actionName, deploymentId, payload = {} }) => {
  const manager = await broker.call(
    'deployment-manager.getGoodActionToCall',
    {
      actionName,
    },
    { caller, meta: { deploymentID: deploymentId } }
  );
  return broker.call(manager.actionToCall, payload, {
    caller,
    meta: {
      deploymentID: deploymentId,
      relationshipID: manager.relationshipID,
    },
  });
};

module.exports = { customCall };
