const { schema } = require('./schemas/response/getInstanceFeedbackRest');
const {
  schema: xRequest,
} = require('./schemas/request/getInstanceFeedbackRest');

const openapi = {
  summary: 'Retrieve user-specific feedback for an instance',
  description: `This endpoint is designed to fetch feedback about a specific instance that pertains to the user. The feedback may include performance metrics, user's responses, and general comments about the instance's completion.

**Authentication:** Users must be authenticated to access the feedback related to the instances they are involved with. The endpoint requires a valid session token to ensure that the feedback provided is specific to the requesting user's account.

**Permissions:** The user needs to have 'view_feedback' permission to retrieve information on this endpoint. Without the appropriate permissions, the server will reject the request indicating insufficient permissions.

Upon receiving a request, the handler first verifies the user's credentials and permissions using middleware components that check for a valid session and proper permission flags. It then proceeds to call a service method 'getInstanceFeedback' from the core logic layer, which queries the database for detailed feedback linked to the user and the specified instance. The data workflow involves gathering comprehensive feedback details, processing them as necessary, and returning them to the user, formatted suitably for easy interpretation. The final output is delivered as a JSON object containing structured feedback data.`,
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
