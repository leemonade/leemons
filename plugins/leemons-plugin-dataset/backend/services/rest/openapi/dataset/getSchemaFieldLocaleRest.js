const { schema } = require('./schemas/response/getSchemaFieldLocaleRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSchemaFieldLocaleRest');

const openapi = {
  summary:
    'Fetches localized schema details for a specific field in a dataset.',
  description: `This endpoint is responsible for retrieving the localized details of a specific schema field within a dataset. The localized details indicate variations or specifics such as localized labels or descriptions, according to different set locales which can support applications in providing multi-lingual features.

**Authentication:** User authentication is mandatory, ensuring that only authenticated users can access the localized schema information. Absence of proper authentication will restrict access to the endpoint.

**Permissions:** Users need to have adequate permissions related to viewing or managing dataset schemas to access this endpoint. This might include roles such as admin, editor, or specific roles granted access to the dataset management module.

The endpoint initiates by validating the user's authentication status and permissions. It then proceeds to call the \`getSchemaFieldLocale\` method from the dataset schema core services. This method accepts parameters such as \`fieldId\` and \`locale\`, and conducts a database query to fetch the corresponding localized data for the specified schema field. The result of this query is processed and returned as JSON, containing detailed localized information of the schema field, which supports front-end applications in rendering context-appropriate label or description based on user’s locale setting.`,
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
