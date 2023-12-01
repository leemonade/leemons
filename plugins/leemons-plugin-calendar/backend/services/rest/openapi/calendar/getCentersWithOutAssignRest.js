const { schema } = require('./schemas/response/getCentersWithOutAssignRest');
const {
  schema: xRequest,
} = require('./schemas/request/getCentersWithOutAssignRest');

const openapi = {
  summary: 'List centers not assigned to a calendar',
  description: `This endpoint lists all the education centers that do not have an assigned calendar configuration in the system. These centers can potentially be assigned a calendar configuration subsequently.

**Authentication:** Users need to be authenticated to ensure secure access to this endpoint. Authentication checks are performed to verify user credentials before proceeding with the operation.

**Permissions:** Appropriate permissions are required for a user to retrieve the list of unassigned centers. The user must have administrative privileges over center configurations or relevant access rights provided by the application's authorization system.

Upon receiving a request, the \`getCentersWithOutAssign\` action in the \`calendar.rest.js\` file is triggered, which calls the \`getCentersWithOutAssign\` method in the \`calendar-configs\` core module. This method is responsible for querying the database to fetch all centers without a linked calendar. The search is performed based on specific criteria that exclude centers already associated with a calendar configuration. When the query is completed, the resultant data - a list of centers - is compiled into a response object and sent back to the client in the form of a JSON array.`,
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
