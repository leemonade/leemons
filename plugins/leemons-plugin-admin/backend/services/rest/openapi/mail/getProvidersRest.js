const { schema } = require('./schemas/response/getProvidersRest');
const { schema: xRequest } = require('./schemas/request/getProvidersRest');

const openapi = {
  summary: 'Lists all available mail service providers',
  description: `This endpoint fetches and lists all the mail service providers configured in the system. It allows the user to view various third-party providers that can be integrated for sending emails from the platform.

**Authentication:** Users need to be authenticated to access this endpoint to ensure that only authorized users can view the available mail service providers.

**Permissions:** Users must have the 'admin' role or specific permission to view mail service providers. Unauthorized access attempts will be logged and denied.

The function begins by validating user authentication and permissions. Once validated, the handler invokes a service method to retrieve all configured mail service providers from the system's configuration. This method checks the internal service registry for available providers, gathers their details (like provider name, configuration settings, and status), and then returns them in a structured list. This list is finally sent back to the client as a JSON response, providing a clear and concise overview of the mail service options available for use within the platform.`,
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
