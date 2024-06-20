const { schema } = require('./schemas/response/removeProviderRest');
const { schema: xRequest } = require('./schemas/request/removeProviderRest');

const openapi = {
  summary: 'Remove an email provider configuration',
  description: `This endpoint handles the deletion of a specific email provider's configuration from the system. The removal process is handled securely and ensures that all related data is also cleaned up properly.

**Authentication:** Users need to be authenticated to perform this operation. A valid session token must be provided as part of the request headers to authorize the deletion operation.

**Permissions:** Administrative permissions are required to access this endpoint. Users must have the 'email.admin' role assigned to successfully execute this action.

Upon receiving the request, the handler first verifies that the provided session token corresponds to a user with the necessary administrative permissions. It then invokes the \`removeProvider\` method from the \`EmailService\`. This method locates the specific email provider configuration based on an identifier provided in the request and proceeds with its deletion from the database. Throughout this process, appropriate error handling mechanisms are in place to manage issues like non-existent identifiers or database errors, ensuring the response accurately reflects the outcome of the operation.`,
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
