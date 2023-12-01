const { schema } = require('./schemas/response/putDependencyRest');
const { schema: xRequest } = require('./schemas/request/putDependencyRest');

const openapi = {
  summary: 'Update a specific dependency record',
  description: `This endpoint updates an existing dependency record within the grading system based on provided data that includes the updated attributes for the dependency. The endpoint ensures that only valid changes are applied to the existing record, maintaining data integrity and the correct operation of the grade dependency logic.

**Authentication:** Users must be authenticated to update a dependency record. Without proper authentication, the request will be rejected and access to the endpoint will be denied.

**Permissions:** Users need to have the 'update_dependency' permission to make changes to dependency records. Attempting to update without adequate permissions will result in the denial of the request.

Upon receiving a request, the handler calls a method that validates the incoming data against a predefined schema to ensure that all required fields are present and properly formatted. If the validation passes, it proceeds to fetch the specific dependency record based on an identifier (usually a record ID) provided in the request's parameters. The next step involves the \`updateDependency\` method from the \`Dependency\` core, which performs the actual update operation in the database. It applies the received changes to the relevant record while enforcing any necessary business logic to maintain the relationships between grade dependencies. After successfully updating the record, the endpoint responds with the updated data, providing confirmation and visibility of the changes to the client.`,
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
