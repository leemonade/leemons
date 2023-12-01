const { schema } = require('./schemas/response/programGroupsRest');
const { schema: xRequest } = require('./schemas/request/programGroupsRest');

const openapi = {
  summary: 'List program groups for academic management',
  description: `This endpoint lists all the program groups available in the academic portfolio for management purposes. It allows for the retrieval of structured data representing different academic programs and their associated groups within the organization.

**Authentication:** Access to this endpoint requires the user to be logged in. The endpoint will validate the user's session or token before proceeding with the request.

**Permissions:** The user needs to have the 'view_program_groups' permission. Without the appropriate permissions, the user will not be able to access this information and will receive an error.

Upon receiving a request, the \`programGroupsRest\` handler calls the \`getProgramGroups\` method from the \`programs\` core module. This core method is responsible for querying the database for all program groups that match certain criteria specified by the request. The handler effectively acts as a bridge between the HTTP request and the core logic, parsing parameters, invoking core logic, and formatting the response. The result is then sent back to the client as a JSON object, comprising an array of program groups with their details, ready for frontend consumption or further API use.`,
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
