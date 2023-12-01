const { schema } = require('./schemas/response/adminRealtimeRest');
const { schema: xRequest } = require('./schemas/request/adminRealtimeRest');

const openapi = {
  summary: 'Provide real-time admin dashboard data',
  description: `This endpoint is designed to fetch and supply real-time data for the admin dashboard, giving administrators a high-level overview of the current system status and activity.

**Authentication:** Access to this endpoint requires the user to be authenticated. Unauthenticated requests will be blocked and the user will be prompted to log in to proceed with the request.

**Permissions:** Elevated permissions are necessary to access this endpoint. Only users with administrative rights are able to retrieve real-time dashboard data, ensuring secure access control to sensitive system information.

Upon handling a request, this endpoint calls the \`getAdminDashboardRealtime\` method from the \`dashboard\` core. This method is responsible for aggregating real-time statistics, such as user activity, system health metrics, and other relevant administrative data. It performs necessary queries and calculations to compile a comprehensive snapshot of the dashboard metrics. Once the data is gathered, it is formatted appropriately and sent back in the HTTP response as a structured JSON object, providing the client with the latest information necessary for effective real-time dashboard monitoring and decision-making.`,
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
