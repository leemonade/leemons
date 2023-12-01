const { schema } = require('./schemas/response/removeProviderRest');
const { schema: xRequest } = require('./schemas/request/removeProviderRest');

const openapi = {
  summary: 'Remove an email provider configuration',
  description: `This endpoint allows for the removal of an email provider configuration from the system. Once removed, the system will no longer use this provider to send emails.

**Authentication:** Users must be authenticated and possess appropriate credentials to delete an email provider configuration. An authentication token is required to validate the user's identity and permissions for the request to be processed.

**Permissions:** Appropriate permissions are required for a user to remove an email provider. The user must have administrative rights or specific access privileges to email configuration management to perform this operation.

Upon receiving the request, \`removeProviderRest\` initiates the removal process by calling the \`removeProvider\` method within the \`Email\` core. This method handles the disconnection and cleanup of resources associated with the email provider being removed. It ensures that all references and configurations are properly deleted, preventing any further usage of the provider. After successful removal, a confirmation is sent back in the response, indicating the completion of the operation.`,
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
