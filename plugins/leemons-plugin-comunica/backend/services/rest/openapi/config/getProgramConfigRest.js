const { schema } = require('./schemas/response/getProgramConfigRest');
const { schema: xRequest } = require('./schemas/request/getProgramConfigRest');

const openapi = {
  summary: 'Retrieve configuration for a specific program',
  description: `This endpoint allows retrieval of the configuration settings for a specific program within the platform. It is designed to fetch data such as program parameters, operational settings, and other related configuration details pertinent to the functioning of the program.

**Authentication:** Users must be logged in to access the program configuration. Without proper authentication, the endpoint will reject the request.

**Permissions:** Users need to have the appropriate permissions to view or edit the program's configuration. The required permission level may vary depending on the organization's settings and the user's role within the platform.

Upon receiving a request, the \`getProgramConfigRest\` handler initiates the process by validating the user's authentication and authorization. Provided the user has the necessary permissions, the handler then calls upon the \`getProgramConfig\` method from the \`config\` service, passing the necessary parameters, which typically include identifiers for the program whose settings need to be fetched. This method handles the intricacies of retrieving the relevant configuration data from the persistent storage or service where it is maintained. Once the data is obtained, it is formatted appropriately and sent back to the requester in the form of a structured JSON object, thereby completing the request-response cycle.`,
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
