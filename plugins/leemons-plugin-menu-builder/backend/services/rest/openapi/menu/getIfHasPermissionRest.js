const { schema } = require('./schemas/response/getIfHasPermissionRest');
const {
  schema: xRequest,
} = require('./schemas/request/getIfHasPermissionRest');

const openapi = {
  summary: 'Checks user permission and retrieves menu structure',
  description: `This endpoint checks if the requesting user has the necessary permissions to access a specific menu structure. Upon validation, it retrieves the menu structure for the user.

**Authentication:** User authentication is mandatory to ensure secure access to the menu structure. Only authenticated users' requests will be processed.

**Permissions:** Users need to have the appropriate permission set assigned to them in order to retrieve the menu structure. The required permission will vary based on the menu being accessed and the roles associated with the user.

The controller handler initiates the flow by determining if the user is authenticated, and if so, whether they have the requisite permissions to view the requested menu structure. This involves integrating with the authentication and permission verification systems. Once the user is authenticated and their permissions are confirmed, the handler calls a method to obtain the specific menu structure. The flow encapsulates any logic necessary to format the menu based on the roles and permissions of the user before sending the response back to the client, which will consist of the menu structure data formatted as a JSON object.`,
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
