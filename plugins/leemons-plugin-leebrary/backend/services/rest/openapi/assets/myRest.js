const { schema } = require('./schemas/response/myRest');
const { schema: xRequest } = require('./schemas/request/myRest');

const openapi = {
  summary: 'Manage asset interactions for users',
  description: `This endpoint facilitates various interactions for a user’s digital assets within the platform which includes fetching, updating, and deleting operations depending on the user's input and query parameters.

**Authentication:** User authentication is mandatory to ensure the secure handling of assets. Access without proper authentication will be denied.

**Permissions:** Users need appropriate permissions to interact with assets. Specific permissions like \`asset_modify\` or \`asset_delete\` might be required based on the action attempted.

The flow within this endpoint begins by determining the type of request made by the user — get, update, or delete. This is managed by routing the request to the respective function within the asset management controller. Each function uses the \`ctx\` parameter to access user details and validate permissions. For 'get' operations, it calls a method to retrieve assets linked to the user. For 'update' or 'delete', additional verification checks if the user has rights to modify or remove the asset. Once the requested action is completed, the response, typically in JSON format, reflects the outcome of this operation (success or error details).`,
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
