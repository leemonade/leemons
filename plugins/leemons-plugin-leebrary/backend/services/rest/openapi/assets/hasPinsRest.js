const { schema } = require('./schemas/response/hasPinsRest');
const { schema: xRequest } = require('./schemas/request/hasPinsRest');

const openapi = {
  summary: 'Check existence of pins for assets',
  description: `This endpoint determines if there are any pinned assets associated with the current request. It primarily checks whether specific assets have been marked or 'pinned' by the user to signify importance or for easy access later on.

**Authentication:** Users are required to be authenticated to verify ownership and to ensure that they have the privileges to check for pins on assets. Only authenticated users' requests will be processed.

**Permissions:** The user must possess the appropriate permissions to retrieve pin status for assets. These permissions ensure that a user is only able to query the pin status of assets they are authorized to interact with.

Upon invocation, the \`hasPinsRest\` handler calls an internal method, typically named something like \`checkAssetPins\`, which retrieves information from a datastore about which assets have been pinned by the user. This method inspects the incoming request, identifies the assets in question, and consults the datastore to determine if these assets have been pinned. The outcome is a JSON object that flags each asset with a boolean indicating the pin status. This information is then sent back to the requester in the HTTP response, detailing which of the queried assets are pinned.`,
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
