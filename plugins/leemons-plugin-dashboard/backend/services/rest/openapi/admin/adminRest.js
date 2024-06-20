const { schema } = require('./schemas/response/adminRest');
const { schema: xRequest } = require('./schemas/request/adminRest');

const openapi = {
  summary: 'Manage and display the admin dashboard configuration',
  description: `This endpoint is responsible for handling requests related to the administration dashboard's configuration and display settings. It serves to aggregate and provide data necessary for the admin dashboard's functionality, tailored specifically to the administrative user's needs and preferences.

**Authentication:** Access to this endpoint requires the user to be authenticated as an administrator. Proper credentials must be provided for authentication, and failure to authenticate will deny access to the endpoint functionalities.

**Permissions:** This endpoint requires that the user have administrative privileges. Users must have particular roles or permissions designated within the system to interact with the admin dashboard functionalities.

Upon receiving a request, the \`getAdminDashboard\` handler in the \`leemons-plugin-dashboard\` invokes related core methods designed to collect and assemble various pieces of information required for the dashboard. It processes these data points, such as system stats, user activities, and operational insights, to create a comprehensive view suitable for admin-level decision-making. Once the data is collated, it is returned in a structured format, allowing the admin dashboard to render an informed and detailed interface for the administrator.`,
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
