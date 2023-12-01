const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List available locales',
  description: `This endpoint lists all the locales supported by the application. It returns an array of locale objects that include language and region codes, as well as any relevant locale-specific data configured in the system.

**Authentication:** Users must be authenticated in order to retrieve the list of locales. Access to the endpoint requires a valid session or authentication token.

**Permissions:** The operation typically requires administrative privileges or a specific permission set granting access to language and locale configurations.

The handler for this endpoint initiates a process that begins with the \`findAll\` method within the \`Locales\` core service. This method is in charge of querying the underlying datastore for all locale records. It handles any necessary transformations or filtration of data to conform to the expected format of locale objects. Once the result is obtained, it is returned directly as a JSON array of locales, completing the request-response cycle for this endpoint.`,
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
