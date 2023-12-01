const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all Funadae reports available',
  description: `This endpoint provides a list of Fundae reports. The returned reports contain information related to the user's Fundae activities, including any analytics or historical data as gathered by the Fundae services.

**Authentication:** Access to this endpoint requires the user to be authenticated. Any request without proper authentication will be rejected.

**Permissions:** Appropriate permissions are necessary to access this endpoint. Users must have the 'view_reports' permission or equivalent rights within the context of the Fundae plugin to retrieve the list of reports.

Upon receiving a request, the endpoint calls the \`listReports\` function provided by the 'report' core module. This function is responsible for consulting the Fundae data storage system to gather a collection of all reports the user is authorized to view. It filters and compiles the report data according to any criteria specified in the request, and then returns the data set. The HTTP response is then crafted to include this data in an easy-to-consume JSON format, providing clients with the necessary information about each report.`,
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
