const { schema } = require('./schemas/response/getLocalesRest');
const { schema: xRequest } = require('./schemas/request/getLocalesRest');

const openapi = {
  summary: 'Get list of available locales',
  description: `This endpoint allows for the retrieval of the full list of available locales within the platform that can be used for localization purposes.

**Authentication:** Access to this endpoint requires the user to be authenticated in the system. Unauthenticated requests will be rejected.

**Permissions:** The user must have the appropriate permission to list available locales. Without sufficient permissions, the request will be denied with an authorization error.

The \`getLocalesRest\` action utilizes the \`getLocales\` method, which can be found in the 'platform' core module. When the endpoint is hit, the action first verifies user authentication and permission levels. Upon successful validation, \`getLocales\` is then invoked. This method performs a query to a database or retrieves the data from a predetermined set of locales configured within the system. It efficiently fetches all the locales that the application supports. The resulting list of locales is then returned to the requester in the form of a JSON array, providing the complete set of locale strings that can be used by the client for proper localization settings.`,
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
