const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all available locales for multilingual content management',
  description: `This endpoint provides a comprehensive list of all locales supported in the multilingual content management system. It enables clients to retrieve a full array of locale identifiers which are necessary for managing translations and localizations within the platform.

**Authentication:** Users need to be authenticated to access this list. The endpoint ensures that only authorized users can access language settings, maintaining a secure environment for managing sensitive locale data.

**Permissions:** Users must possess 'view_locales' permission to access this endpoint. This requirement ensures that only users with adequate privileges can view and manage locales, aligning with the system's security protocols for sensitive data access.

Upon receiving a request, the \`listRest\` handler initiates the process by invoking the \`listLocales\` method in the core locale management module. This method queries the system's internal database to fetch all active locales. The retrieved data is then formatted appropriately before being sent back to the client. The response includes a structured list of locale identifiers, each associated with its specific language and regional details, formatted as a JSON array. The completion of this method concludes the request-response cycle for this specific endpoint.`,
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
