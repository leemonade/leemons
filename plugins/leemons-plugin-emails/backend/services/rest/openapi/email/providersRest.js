const { schema } = require('./schemas/response/providersRest');
const { schema: xRequest } = require('./schemas/request/providersRest');

const openapi = {
  summary: 'Manage email service providers',
  description: `This endpoint facilitates the management of various email service providers integrated into the system. It allows for the listing, addition, and configuration of email service providers utilized by the application to send emails.

**Authentication:** Users must be authenticated to manage the email service providers. Unauthorized access will be prevented, and appropriate authentication credentials must be provided.

**Permissions:** Administrative permissions are required to access this endpoint. Users must have the necessary rights to configure and manage email service providers to execute actions through this endpoint.

Upon receiving a request, the handler first verifies the user's authentication and permissions to ensure they are authorized to manage email providers. It then proceeds by calling specific methods depending on the action: for listing providers, it invokes a method to retrieve all configured providers; for adding a new provider, it uses a method that validates and stores the provider's settings; and for updating an existing provider, it employs a method to modify the provider configuration. Each process is handled securely and ensures that only valid and authorized changes are committed to the system.`,
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
