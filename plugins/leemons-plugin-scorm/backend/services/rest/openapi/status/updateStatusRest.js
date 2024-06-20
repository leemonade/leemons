const { schema } = require('./schemas/response/updateStatusRest');
const { schema: xRequest } = require('./schemas/request/updateStatusRest');

const openapi = {
  summary: 'Update SCORM package status for a user',
  description: `This endpoint enables updating the status of a SCORM package linked to a specific user within the Leemons platform. It changes the state of user progress and interaction with the SCORM content to reflect recent activities or completion status.

**Authentication:** User authentication is required to access and modify SCORM package status. Users must be logged in with valid credentials to successfully call this endpoint.

**Permissions:** This endpoint requires that the user has permissions to modify SCORM package statuses, typically granted to educators or administrators who manage e-learning content and tracking.

Upon receiving a request, the \`updateStatusRest\` handler invokes the \`updateStatus\` method in the \`status\` core service. This method performs several operations: it first validates the user's identity and permissions to ensure they are authorized to update SCORM statuses. It then processes the input data to adjust the relevant user's SCORM status in the database. This process includes error handling to manage possible exceptions such as invalid input or database errors. Finally, the response is formulated to indicate the success or failure of the update operation, along with appropriate status codes.`,
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
