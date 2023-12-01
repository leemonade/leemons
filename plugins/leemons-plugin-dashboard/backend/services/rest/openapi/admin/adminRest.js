const { schema } = require('./schemas/response/adminRest');
const { schema: xRequest } = require('./schemas/request/adminRest');

const openapi = {
  summary: 'Access administrative dashboard metrics and statistics',
  description: `This endpoint provides a comprehensive set of metrics and statistics tailored for administrators to assess the health and performance of the platform. It aggregates diverse data points into a digestible dashboard view, facilitating quick insights and informed decision-making.

**Authentication:** Access to this endpoint requires user authentication. Unauthenticated users will be prevented from retrieving administrative dashboard data.

**Permissions:** Required permissions include administrative-level privileges. Users without the necessary administrative permissions will be unable to access this endpoint.

Upon receiving a request, \`getAdminDashboard.js\` is called, initiating the data aggregation process for the admin dashboard. This function interacts with various services and possibly middlewares to gather relevant metrics such as user statistics, system health indicators, and other critical data points necessary for administrative oversight. The outcome is a curated dashboard view, which is then returned in the response as a structured JSON object, encapsulating key information for the admin user.`,
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
