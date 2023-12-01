const { schema } = require('./schemas/response/getSchemaLocaleRest');
const { schema: xRequest } = require('./schemas/request/getSchemaLocaleRest');

const openapi = {
  summary: 'Retrieve localized dataset schema details',
  description: `This endpoint provides the schema details of a dataset with localization considerations applied. It merges schema definitions with locale-specific variations to return a fully localized dataset schema ready for consumption by clients that require content in a specific language.

**Authentication:** Access to this endpoint requires the user to be authenticated. Unauthenticated requests will be met with authorization failure responses.

**Permissions:** This endpoint requires the user to have specific permissions to view the localized schema of a dataset. Without the necessary permissions, the user's request to this endpoint will be denied.

Upon receiving a request, the \`getSchemaLocaleRest\` handler invokes the \`getSchemaWithLocale\` function from the \`datasetSchema\` core module. This function is responsible for fetching the base dataset schema and then applying any locale-specific customizations that are stored separately in the \`datasetSchemaLocale\` core module. The merging process takes into account the current user's locale or the one specified in the request, providing a contextually relevant schema. Once the localized schema is ready, the handler sends it back in the HTTP response, formatted as a JSON object, suitable for clients to use directly.`,
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
