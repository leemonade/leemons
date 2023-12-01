const { schema } = require('./schemas/response/fileRest');
const { schema: xRequest } = require('./schemas/request/fileRest');

const openapi = {
  summary: 'Manage file asset retrieval and operations',
  description: `This endpoint handles various operations related to file assets within the leebrary plugin. These operations include fetching specific file details, managing user permissions, and providing secure access to files.

**Authentication:** Users need to be authenticated to interact with file assets. The endpoint uses the user's session or token to identify and validate their requests.

**Permissions:** Permissions are rigorously enforced. The user must have the appropriate permissions to view or manipulate the file asset, which is determined through the leebrary plugin's internal permission system.

The endpoint's workflow begins by calling the \`getByFile\` core method, supplying the necessary query parameters to identify the file asset. It then processes the file through functions like \`getRelatedAssets\`, \`handleIsPublic\`, and \`handleUserPermissions\` which are responsible for fetching related assets, determining the asset's public status, and verifying the user's permissions respectively. After successfully handling these operations, it leverages methods such as \`dataForReturnFile\` to format the return data and \`handleReadStream\` to initiate file streaming if required, creating a secure and efficient data transfer process to the client.`,
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
