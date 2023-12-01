const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Sets permissions on specified assets',
  description: `This endpoint sets specific permissions for given assets within the system. It allows users to define who can access certain resources and what operations they're permitted to perform on those resources.

**Authentication:** A user must be authenticated to modify permissions. Without proper authentication, the request will be rejected.

**Permissions:** Users must have administrative privileges or sufficient rights to modify permissions for the specified assets. Attempting to alter permissions without the required authorization will result in an error.

The controller first validates the user's identity and authorization level. Upon successful validation, it proceeds to the \`set\` method from the \`permissions.set\` core, where the permissions are updated according to the provided details in the request. This typically involves reading the incoming request body to fetch the relevant asset identifiers and permission specifications. The core logic determines whether to add or remove permissions based on the changes submitted. Once updates are made, it returns a success response indicating that the permissions have been set correctly, or an error message describing any issues encountered during the process.`,
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
