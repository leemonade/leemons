const { schema } = require('./schemas/response/classDetailForDashboardRest');
const {
  schema: xRequest,
} = require('./schemas/request/classDetailForDashboardRest');

const openapi = {
  summary:
    "Displays detailed information about classes for the user's dashboard",
  description: `This endpoint provides a comprehensive overview of a specific class, tailored for display on the user's dashboard. It includes insights and metrics relevant to the class's progress, teaching effectiveness, and student engagement.

**Authentication:** User authentication is required to ensure secure access to the class details. Only authenticated users can view class-related data, protecting sensitive educational information.

**Permissions:** Users need to have the 'view_class_dashboard' permission. This ensures that only users with the necessary rights can access detailed class insights, maintaining confidentiality and integrity of educational data.

Upon receiving a request, the \`classDetailForDashboardRest\` method within \`class.rest.js\` begins by validating the provided class ID against the database. It uses this ID to fetch detailed information about the class, such as attendance rates, student performance metrics, and recent assessments. The data fetching process involves several service calls to different parts of the system, including attendance services and grade management systems. Once all data is compiled, the method formats it into a user-friendly response, which is then sent back to the client as a JSON object, offering a detailed view suitable for a dashboard presentation.`,
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
