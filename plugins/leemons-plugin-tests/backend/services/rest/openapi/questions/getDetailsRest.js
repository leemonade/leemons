const { schema } = require('./schemas/response/getDetailsRest');
const { schema: xRequest } = require('./schemas/request/getDetailsRest');

const openapi = {
  summary: 'Fetch multiple question details by IDs',
  description: `This endpoint is responsible for fetching detailed information about a set of questions based on their unique identifiers. It provides aggregated question details useful for constructing comprehensive question views or performing batch operations on questions.

**Authentication:** The endpoint requires users to be authenticated prior to accessing the question details. Without a valid authentication token, the endpoint will deny access.

**Permissions:** Users need to have the appropriate permissions to view the specified questions. The level of access might vary according to the user's roles and the privacy settings of the questions.

Upon receiving a valid request, the handler calls the \`getByIds\` method located in the \`questions\` core. The \`getByIds\` method accepts an array of question IDs and retrieves the corresponding question objects from the system's data store. These objects are then processed to return a comprehensive view of each question, including metadata and content. The service responds with a JSON payload containing the details of the requested questions, ensuring that the information adheres to the permission constraints and is formatted according to the schema expected by the requesting client.`,
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
