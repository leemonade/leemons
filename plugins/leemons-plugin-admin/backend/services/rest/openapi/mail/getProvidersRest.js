const { schema } = require('./schemas/response/getProvidersRest');
const { schema: xRequest } = require('./schemas/request/getProvidersRest');

const openapi = {
  summary: 'Fetch mail service providers',
  description: `This endpoint fetches the list of available mail service providers configured within the system. It allows users to view which providers can be used for sending and receiving emails through the platform.

**Authentication:** Users need to be authenticated to request the list of mail service providers. Unauthenticated requests will not be processed.

**Permissions:** Users must have the appropriate permissions to view the available mail service providers. Typically, this might require administrative permissions, as the information pertains to system-wide settings.

Upon receiving a request, the handler first checks the authentication status of the user and then validates their permissions to access this information. Once authorized, it invokes the \`getProviders\` method within the \`MailService\`, providing the necessary context. This method is responsible for querying the system's configuration and retrieving a list of the mail service providers. The result, a collection of provider details, is then formatted appropriately and sent back to the client as a JSON object in the response body.`,
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
