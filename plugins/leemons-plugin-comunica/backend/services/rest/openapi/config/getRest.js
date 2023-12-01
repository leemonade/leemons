const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetch configuration settings for the application',
  description: `This endpoint is responsible for retrieving the entire configuration settings used by the application. It essentially fetches the system-wide configuration parameters which are required for proper functioning and customization of the application behavior.

**Authentication:** Users need to be authenticated to request the configuration settings. The endpoint will validate the user's session or token before proceeding with the request.

**Permissions:** The user must have administrative rights to access the configuration settings. Without the necessary permissions, access to the endpoint will be restricted.

Upon receiving a request, the handler begins by validating the user's authentication and authorization status. Once verified, it calls the \`getConfig\` method from the \`ConfigService\`. This method interacts with the configuration core layer, possibly involving reading from a configuration file or a database. It processes the raw configuration data and formulates it into a structured object or collection of settings relevant to the user's permissions. The response is then returned as a JSON object that encapsulates the application's configuration settings.`,
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
