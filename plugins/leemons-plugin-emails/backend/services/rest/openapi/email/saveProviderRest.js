const { schema } = require('./schemas/response/saveProviderRest');
const { schema: xRequest } = require('./schemas/request/saveProviderRest');

const openapi = {
  summary: 'Saves the email provider configuration',
  description: `This endpoint allows for the configuration of an email service provider which the system will use to send emails. It accepts provider-specific settings and credentials and stores them securely.

**Authentication:** User must be authenticated and have a valid session to access this endpoint. Unauthorized access is strictly denied.

**Permissions:** Users need to have administrative rights to configure email service providers. Without the correct permissions, the user's request to save a provider configuration will be rejected.

The controller handler initiates the process by validating the request body with the required parameters for a given email service provider. It then calls the \`saveProvider\` method from the \`Email\` core service. The \`saveProvider\` method takes care of storing the configuration details in a secure manner, possibly encrypting sensitive information such as API keys or passwords, and ensuring the integrity of the data. If the operation is successful, the handler sends back a confirmation response, indicating the email provider configuration has been successfully saved. In case of any errors, it returns the appropriate error message and status code to inform the client of the failure.`,
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
