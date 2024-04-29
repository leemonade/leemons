const { schema } = require('./schemas/response/getFeedbackRest');
const { schema: xRequest } = require('./schemas/request/getFeedbackRest');

const openapi = {
  summary: 'Collect and display user-specific feedback submissions',
  description: `This endpoint handles the collection and retrieval of feedback submissions specific to a user within the application. It fetches feedback based on user-specific queries, ensuring tailored content delivery that is relevant to the individual's interactions or contributions within the platform.

**Authentication:** User authentication is required to access this endpoint. Users must be logged in to view or submit their feedback, ensuring that feedback remains personal and secure.

**Permissions:** Specific permissions regarding who can view or submit feedback are enforced. Users need appropriate permissions to perform these actions, typically dependent on their role within the application or specific administrative rights assigned to their profile.

Upon receiving a request, the \`getFeedbackRest\` handler initiates by validating user authentication and permissions. The handler then proceeds to invoke the \`getFeedback\` method from the 'feedback' core. This method is responsible for accessing the database and retrieving feedback entries that match the criteria specific to the authenticated user. The process involves querying the database with parameters that include user identifiers and other relevant data filters. Once the data is fetched and compiled, it is returned to the user in a structured JSON format, providing a clear and concise overview of the feedback directly related to the user.`,
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
