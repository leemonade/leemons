const { schema } = require('./schemas/response/getSchemaRest');
const { schema: xRequest } = require('./schemas/request/getSchemaRest');

const openapi = {
  summary: 'Fetches a dataset schema based on given criteria',
  description: `This endpoint allows for the retrieval of a dataset schema by providing specific selection criteria. It is designed to query the database schema configuration to obtain the structure and rules that govern a particular dataset within the system.

**Authentication:** User must be authenticated in order to request for a dataset schema. Unauthorized access attempts will be rejected.

**Permissions:** Users need to possess the appropriate permissions to access the requested dataset schema. The endpoint checks for these permissions, and access is granted only if the user has sufficient privileges as defined by the system's access control policies.

Once the \`getSchemaRest\` action is triggered, the process begins with the validation of parameters received by the request, followed by an authentication and permissions check using middleware or built-in service hooks. Assuming the requester passes these checks, the action then calls upon the \`getSchema\` method from \`datasetSchema\` core, that further interfaces with the underlying database to fetch the schema details. This method filters out the schema based on the given criteria and encapsulates business logic such as transforming and sanitizing the retrieved data. The final response to the client is a detailed JSON object representing the dataset schema, or an error message if the operation cannot be completed as requested.`,
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
