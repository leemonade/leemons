const { schema } = require('./schemas/response/setInstanceTimestampRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceTimestampRest');

const openapi = {
  summary: 'Update instance timestamp',
  description: `This endpoint allows updating the timestamp associated with a specific instance in the system. The operation ensures that the instance's date-related data is accurate and reflects the most current state.

**Authentication:** Users must be authenticated to use this endpoint. Without proper authentication credentials, the request will be rejected.

**Permissions:** Users require specific permissions to update instance timestamps. The necessary permissions differ depending on the level of access that the user has to the instance. Only authorized personnel with time adjustment capabilities can perform this operation.

Upon receiving a request, the \`setInstanceTimestamp\` handler starts by validating the authenticated user's permissions to ensure they have the rights to update the instance timestamp. After validation, it invokes the \`setInstanceTimestamp\` method from the \`Tests\` core with the instance ID and new timestamp data passed in the request. The method then interacts with the appropriate data storage service to update the timestamp. On successful completion, the endpoint responds with a confirmation message and updated timestamp. If the process encounters any issues, it returns an error response detailing the encountered problem.`,
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
