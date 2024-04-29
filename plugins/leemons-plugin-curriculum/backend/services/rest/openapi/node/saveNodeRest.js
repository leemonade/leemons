const { schema } = require('./schemas/response/saveNodeRest');
const { schema: xRequest } = require('./schemas/request/saveNodeRest');

const openapi = {
  summary: 'Saves or updates curriculum node details',
  description: `This endpoint is designed for the creation or updating of curriculum node details. It handles both the creation of new nodes and the updates to existing nodes, focusing on saving the data related to a specific curriculum structure, such as lectures, lessons, or topics within the educational platform.

**Authentication:** User authentication is required to ensure that only logged-in users can alter curriculum nodes. Authenticated status is mandatory to proceed with any data modification.

**Permissions:** Users need to have specific rights to create or edit curriculum nodes. The required permissions include role-based checks that ensure only authorized personnel such as educators or curriculum managers can modify the content.

The process begins with the \`saveNodeRest\` action receiving the request and extracting necessary data such as node details from the request body. It then calls the \`saveNode\` method from the \`nodes\` core module, passing the extracted data. This method is responsible for checking the existence of the node by ID, performing validations, and then either updating the existing node or creating a new one if it does not exist. All database interactions necessary for storing or updating the node are handled within this method. On successful completion of these operations, the method returns an acknowledgment that the node details have been successfully saved or updated, which is then relayed back to the user through a standardized API response format.`,
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
