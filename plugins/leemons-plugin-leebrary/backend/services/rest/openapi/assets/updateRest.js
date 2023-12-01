const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update asset details based on the provided parameters',
  description: `This endpoint allows for the updating of an asset's metadata and associated data. The update operation may include changes to tags, subjects, categories, and other asset properties.

**Authentication:** Users must be authenticated to update asset details. An authentication token must be provided and verified for the process to proceed.

**Permissions:** A user requires specific permissions to update an asset. The exact permission required depends on the ownership and existing sharing settings of the asset.

From the \`updateRest\` handler in the \`assets.rest.js\` file, the request is passed to \`update\` method from the \`AssetsController\`. This method performs a series of operations to update the asset. Initially, it may validate the provided parameters using schemas defined in the \`validations\` directory. Then, permission checks are made to ensure the user has the right to perform the update operation. If so, methods from the \`update\` service in the \`core/assets\` folder are called, which include \`prepareAssetData.js\`, \`update.js\`, and any relevant methods to handle related properties like tags and subjects. After the update, the controller might use methods from the \`getByIds\` service to retrieve the updated asset details. The final response includes the updated asset data, confirming the success of the update.`,
  AIGenerated: 'true',
  'x-request': xRequest,
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
};

module.exports = {
  openapi,
};
