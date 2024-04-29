const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetch and calculate user scores',
  description: `This endpoint is designed to calculate and return scores based on a user's activities within the application. The calculations are to reflect the user's performance and achievements across various metrics defined by the system architecture.

**Authentication:** This endpoint requires users to be authenticated to ensure that scores are fetched for the rightful owner. Unauthorized access is strictly prohibited, and authentication mechanisms are in place to verify user credentials.

**Permissions:** The user must have the appropriate permission to view scores. Typically, this includes roles such as student, teacher, or administrator, depending on the implementation specifics of the platform.

From the initial request, the 'getRest' action utilizes the \`getScores\` method to retrieve all relevant scoring data associated with the user. It processes this information through a series of business logic layers implemented within the \`scores.rest.js\`. Each score component is derived and compiled based on user-specific activities and performance parameters. The data flow includes error handling to manage any inconsistencies or failures in data retrieval. Subsequently, the resolved data is formatted and sent back as a JSON response, providing a complete overview of the user's scores within the application.`,
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
