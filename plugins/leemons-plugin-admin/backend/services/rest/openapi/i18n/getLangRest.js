const { schema } = require('./schemas/response/getLangRest');
const { schema: xRequest } = require('./schemas/request/getLangRest');

const openapi = {
  summary: 'Retrieve available languages for the platform',
  description: `This endpoint fetches all language settings currently available on the platform, providing a comprehensive list of all supported languages. This allows users or systems to understand what languages they can select for use in localizing the user interface or content.

**Authentication:** User authentication is required to access this endpoint. Users must provide a valid session token that will be verified prior to allowing access to the language data.

**Permissions:** Users need to have the 'view_languages' permission to retrieve the list of available languages. This ensures that only authorized personnel can view and potentially modify language settings.

Upon receiving a request, the \`getLangRest\` handler calls the \`getLanguages\` method from the internationalization service. This method queries the database for all active languages marked as available in the system. The result set includes language codes, descriptions, and any relevant metadata associated with each language. After the data is retrieved, it's formatted into a JSON structure and returned in the response body to the requester. This endpoint ensures data consistency and secured access to language information within the platform.`,
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
