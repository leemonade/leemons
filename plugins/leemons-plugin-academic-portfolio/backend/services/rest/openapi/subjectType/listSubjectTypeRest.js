const { schema } = require('./schemas/response/listSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/listSubjectTypeRest');

const openapi = {
  summary: 'Lists all subject types available in the academic portfolio',
  description: `This endpoint provides a comprehensive listing of all subject types defined in the academic portfolio management system. It is primarily used to retrieve and display a catalog of subject types for academic planning and management purposes.

**Authentication:** User authentication is required to access the list of subject types. Users must be logged in with valid credentials to make requests to this endpoint.

**Permissions:** Users need specific permissions to view the list of subject types. Typically, administrative access or permissions related to academic management are necessary to access this data.

The endpoint starts by invoking the \`listSubjectType\` method from the 'subject-type' core module. This method carries out a query to the system's database to fetch all existing subject type entries stored in the data model dedicated to academic structures. The result of this method is an array of subject type objects, each containing essential data such as type name, description, and applicable metadata. This array is then passed back through the Moleculer service to the client as a JSON response, giving a clear view of all available subject types that can be utilized for academic organization within the platform.`,
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
