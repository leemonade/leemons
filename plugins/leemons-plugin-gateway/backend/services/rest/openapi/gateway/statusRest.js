const { schema } = require('./schemas/response/statusRest');
const { schema: xRequest } = require('./schemas/request/statusRest');

const openapi = {
  summary: 'Check the operational status of the service',
  description: `This endpoint checks and reports the current operational status of various service components. It provides a quick health check to ensure all parts of the system are functioning as expected, ideal for monitoring and preventative maintenance routines.

**Authentication:** This endpoint does not require user authentication, enabling an unauthenticated status check.

**Permissions:** No specific permissions are required to access this endpoint. It is available to any user or system checking the service status.

The status check works by invoking multiple internal methods designed to test the health and responsiveness of each service component. The flow begins with gathering data on various key components such as the database connectivity, external API responsiveness, and internal service communication. Each component's status is evaluated separately, aggregated into a final comprehensive status report, and returned as a JSON object. This complete status includes whether each component is online, operational, and any issues detected, providing clear visibility into the system's current state.`,
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
