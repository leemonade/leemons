const path = require('path');
const jsonSchemaGenerator = require('json-schema-generator');

const { getControllerPath, prepareControllerFile } = require('./lib/controllers');
const { prepareOpenapiFile } = require('./lib/openapi');
const { buildServicePath } = require('./lib/services');

/**
 * Decomposes the action name into its components
 * @param {string} actionName - The action name
 * @returns {Array} The components of the action name
 */
function decomposeActionName(actionName) {
  const [version, plugin, service, controller] = actionName.split('.');
  return [version, plugin, service, controller];
}

/**
 * Creates the openapi response
 * @param {Object} params - The parameters
 * @param {Object} params.res - The response
 * @param {Object} params.ctx - The context
 */
function createOpenapiResponse({ res, ctx }) {
  const actionName = ctx.action.name;
  const schema = jsonSchemaGenerator(res);
  try {
    const [, plugin, service, controller] = decomposeActionName(actionName);

    const serviceFilePath = buildServicePath({ plugin, service });
    const controllerFilePath = getControllerPath(serviceFilePath, service);

    prepareControllerFile({ controllerFilePath, service, controller, ctx });

    prepareOpenapiFile(path.dirname(controllerFilePath, 'rest'), service, controller, schema);
  } catch (error) {
    ctx.logger.error(`ERROR Openapi: ${ctx.action.name} - ${error.message}`);
  }
}

module.exports = { createOpenapiResponse };
