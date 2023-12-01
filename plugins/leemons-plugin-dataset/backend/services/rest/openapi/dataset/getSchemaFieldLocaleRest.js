const { schema } = require('./schemas/response/getSchemaFieldLocaleRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSchemaFieldLocaleRest');

const openapi = {
  summary: 'Retrieve localized fields of a dataset schema',
  description: `This endpoint allows for the retrieval of localized fields for a specific dataset schema. It is designed to return the translations and localized information related to a dataset schema's fields based on the provided locale parameters.

**Authentication:** User authentication is required to ensure that the requestor has the necessary credentials to access dataset schema information. Without proper authentication, the endpoint will reject the request.

**Permissions:** The user must possess the appropriate permissions to access localized schema details. These permissions ensure that only authorized personnel can retrieve localization details of dataset schema fields.

Upon receiving a request, the handler first verifies if the user is authenticated and authorized to access the information. If authentication or permissions are lacking, the request is declined. Once authorized, the handler calls on the \`getSchemaWithLocale\` method from the \`datasetSchema\` core module, passing the schema identifier and the desired locale. This method interacts with the underlying storage mechanism to fetch the schema and its localized fields. It manages the complexity of merging the schema information with the localized text for the fields. The endpoint finally responds with the localized details of the dataset schema in a format that clients of the API can consume.`,
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
