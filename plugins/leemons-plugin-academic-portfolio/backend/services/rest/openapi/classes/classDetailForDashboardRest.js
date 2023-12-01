const { schema } = require('./schemas/response/classDetailForDashboardRest');
const {
  schema: xRequest,
} = require('./schemas/request/classDetailForDashboardRest');

const openapi = {
  summary: 'Displays a dashboard summary of the class details',
  description: `This endpoint provides a comprehensive summary of a specific academic class, tailored for dashboard views. It includes essential information such as attendance, performance metrics, and current status, designed to give an overview at a glance to educators and administrators.

**Authentication:** Access to this endpoint is restricted to logged-in users only. Authentication ensures that individual user sessions are recognized, and access control can be correctly enforced.

**Permissions:** The user must have the 'view_class_dashboard' permission to retrieve class details. Without requisite permissions, the user will not be able to access the data presented by this endpoint.

Upon receiving a request, the handler \`classDetailForDashboardRest\` uses the \`ClassDetailForDashboard\` class to aggregate data related to a specific classroom session. It interacts with various internal services to collect information such as enrolment numbers, progress reports, and other relevant educational metrics. The service then formats this data into a user-friendly structure, suitable for presenting in a dashboard. The flow ends with the endpoint returning this structured data in JSON format, ready for the frontend to render an informative dashboard layout.`,
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
