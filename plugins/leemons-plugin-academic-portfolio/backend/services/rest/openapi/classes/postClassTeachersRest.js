const { schema } = require('./schemas/response/postClassTeachersRest');
const { schema: xRequest } = require('./schemas/request/postClassTeachersRest');

const openapi = {
  summary: 'Assign multiple teachers to a class',
  description: `This endpoint is responsible for associating multiple teachers with a specific class within the academic infrastructure. It enables batch operations for updating academic records with respect to instructor assignments to classes.

**Authentication:** Users need to be authenticated to use this endpoint. Only requests with valid credentials will be processed.

**Permissions:** Users must have the 'manage_teachers' permission to assign teachers to a class. Without sufficient permissions, the endpoint will reject the request.

The handler begins by validating the input payload against a pre-defined schema to ensure that all required details, such as the class ID and teacher IDs, are present and correctly formatted. Then, it calls the \`addClassTeachersMany\` method from the \`classes\` core service. This method interacts with the underlying datastore to update the class information with the specified teachers. It is designed to handle multiple updates in a transactional manner, ensuring data integrity and atomicity of batch operations. After successful execution, the endpoint returns a confirmation of the assignment operation, including the affected records in the response payload.`,
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
