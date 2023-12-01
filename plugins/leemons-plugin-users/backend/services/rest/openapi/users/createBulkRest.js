const { schema } = require('./schemas/response/createBulkRest');
const { schema: xRequest } = require('./schemas/request/createBulkRest');

const openapi = {
  summary: 'Bulk creation of users',
  description: `This endpoint is responsible for the bulk creation of user accounts. It processes an array of user information and creates new user records in the system database. Users are added with their respective profiles and permissions based on the data provided in the request payload.

**Authentication:** The endpoint requires the user to be authenticated prior to making the request. Unauthenticated access is not permitted, and such attempts will be rejected.

**Permissions:** The user must have administrative privileges or specific user management permissions to perform bulk user creation. Without the required permissions, the request to this endpoint will be denied.

Upon receiving the request, the \`createBulkRest\` handler validates the input data and checks for required fields as defined in the validation schema. It then calls the \`addBulk\` method from the \`Users\` service, sending it the cleaned and validated user data. The \`addBulk\` method interacts with the database to insert multiple user records, handling any constraints or unique field requirements (such as usernames or email addresses). Once the operation is successfully completed, the service responds with a summary of the created users, including their IDs and any other relevant information, or it provides an error message detailing why the creation failed for particular user entries. The final response is sent back to the client in JSON format, indicating the status of the bulk user creation process.`,
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
