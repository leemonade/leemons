const { schema } = require('./schemas/response/getSchemaRest');
const { schema: xRequest } = require('./schemas/request/getSchemaRest');

const openapi = {
  summary: 'Fetch dataset schema based on specifications',
  description: `This endpoint retrieves the detailed schema for a specific dataset based on the given dataset identifier. It provides a comprehensive outline of the dataset's structure, including field types, mandatory rules, and other relevant metadata.

**Authentication:** Access to this endpoint requires the user to be authenticated. A valid session or authentication token must be presented to ensure that the request is being made by a legitimate user.

**Permissions:** Users must have the role or permission set that explicitly grants them access to view dataset schemas. Without these permissions, the request will be denied, ensuring data security and appropriate access control.

After validating the user's authentication and permissions, the handler engages the \`getSchema\` function from the \`datasetSchema\` core module. This function is tasked with retrieving the schema details from the database using the dataset identifier provided in the request parameters. The entire operation is managed within the Moleculer service context, facilitating error handling and response formatting. The successful execution of this function results in a JSON object that describes the dataset schema, which is then relayed back to the user through the HTTP response.`,
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
