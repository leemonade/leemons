const { schema } = require('./schemas/response/adminRealtimeRest');
const { schema: xRequest } = require('./schemas/request/adminRealtimeRest');

const openapi = {
  summary: 'Provide real-time dashboard data for administrators',
  description: `This endpoint provides a real-time view of the dashboard data specifically tailored for administrators. It facilitates the monitoring and management of various system metrics and activities from a centralized dashboard interface.

**Authentication:** Access to this endpoint requires the user to be authenticated. Failure to provide valid authentication credentials will prevent access.

**Permissions:** The user must have administrator-level permissions to access this endpoint. This ensures that only authorized personnel can view and interact with the sensitive real-time data presented.

Upon receiving a request, the \`adminRealtimeRest\` handler firstly verifies the authentication and permissions of the requesting user to ensure they meet the required criteria. If authentication or permissions are inadequate, the request is denied. Once authenticated, it invokes the \`getAdminDashboardRealtime\` core method. This method consolidates data from various services and modules within the platform, processing them to generate real-time insights. The data is then returned to the admin user through this endpoint in a structured JSON format, which includes key performance metrics and system statuses crucial for administrative monitoring and decision-making.`,
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
