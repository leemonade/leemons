const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all reports accessible by the user',
  description: `This endpoint lists all the reports generated by the system that the authenticated user has access to. The reports can vary from usage statistics to performance analytics, depending on the user's role and permissions in the system.

**Authentication:** User authentication is required to ensure secure access to the reports. Only authenticated users can retrieve their available reports list.

**Permissions:** The user needs to have 'view_reports' permission to access this endpoint. If the user does not have the necessary permissions, the endpoint will return an unauthorized access error.

Upon receiving a request, the \`listReports\` handler in the \`ReportService\` first checks for user authentication and required permissions. If authentication or permissions checks fail, it returns an appropriate error response. If the checks pass, it invokes the \`listAllReports\` method from the \`Report\` core. This core method queries the database for reports accessible to the user, based on their roles and permissions, and returns a structured list of report data. This data is then formatted appropriately and sent back to the user as a JSON response.`,
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
