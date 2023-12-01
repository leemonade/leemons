const { schema } = require('./schemas/response/generateRest');
const { schema: xRequest } = require('./schemas/request/generateRest');

const openapi = {
  summary: 'Generate Fundae training activity report',
  description: `This endpoint is responsible for generating a report regarding Fundae training activities tailored to the requesting user's context. It compiles the relevant data which may include training schedules, participation records, performance metrics, and any other pertinent information associated with Fundae training programs.

**Authentication:** Users must be authenticated to request the generation of a Fundae training activity report. In absence of proper authentication, the request will be rejected.

**Permissions:** Specific permissions check is implemented to ensure that only users with the proper authority can request a report. The required permissions are checked against the user's role and access level within the system.

Upon receiving the request, the handler initiates the report generation process by first verifying user authentication and permissions. It then delegates the task to the \`generateReport\` method in the 'report' core module. This method orchestrates the data aggregation and compilation process, interacting with various data sources and utilizing business logic to construct a comprehensive Fundae training activity report. Once processed, the report is returned to the user in the appropriate format, typically as a downloadable file, which contains the detailed training activity information.`,
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
