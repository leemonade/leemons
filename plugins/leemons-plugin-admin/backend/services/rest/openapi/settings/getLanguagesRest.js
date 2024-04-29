const { schema } = require('./schemas/response/getLanguagesRest');
const { schema: xRequest } = require('./schemas/request/getLanguagesRest');

const openapi = {
  summary: 'Fetch available languages from the system',
  description: `This endpoint retrieves the list of all languages currently supported or available within the system administration panel. The output includes language codes and corresponding language names arranged in a structured format.

**Authentication:** Users need to be authenticated in order to fetch the list of available languages. Access to this endpoint requires valid user credentials, and any attempt to access it without proper authentication will be rejected.

**Permissions:** The endpoint requires administrative permissions, specifically the 'view_languages' permission. Users without these permissions will not be allowed to access this endpoint and will receive an appropriate authorization error.

Upon receiving a GET request, the \`getLanguages\` handler in \`settings.rest.js\` calls the corresponding method in the core settings module. This method queries the internal configuration or database to extract a detailed list of languages set up in the admin settings. This includes both default and optionally added languages by the system administrators. The response is then formatted into a JSON object that lists language codes alongside their full names and returned to the user making the request.`,
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
