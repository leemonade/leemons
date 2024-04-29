const { schema } = require('./schemas/response/saveProviderRest');
const { schema: xRequest } = require('./schemas/request/saveProviderRest');

const openapi = {
  summary: 'Saves a new email service provider configuration',
  description: `This endpoint allows the addition of a new email service provider configuration into the system. It handles the setup of email service credentials, server details, and other necessary configurations required to send emails through the specified provider.

**Authentication:** Users must be authenticated to access this endpoint. Authentication ensures that only authorized users can add or modify email service provider configurations.

**Permissions:** Users need to have 'admin' privileges to configure email service providers. This ensures that only users with sufficient permissions can make changes that affect email communications.

The endpoint workflow begins with the validation of the provided input parameters to ensure they meet the system's requirements for an email service provider configuration. It then proceeds to call the \`addProvider\` method from the \`EmailService\` core, which is responsible for incorporating the new provider settings into the database. This process involves storing sensitive information such as API keys and SMTP server details securely. Upon successful addition, the service returns a confirmation of the new configuration's save operation, and relevant details are logged for audit purposes.`,
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
