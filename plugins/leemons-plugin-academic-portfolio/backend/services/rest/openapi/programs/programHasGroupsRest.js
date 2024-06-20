const { schema } = require('./schemas/response/programHasGroupsRest');
const { schema: xRequest } = require('./schemas/request/programHasGroupsRest');

const openapi = {
  summary: 'Check membership of programs and their groups',
  description: `This endpoint verifies if the specified programs contain any group associations and returns the membership status. The process determines the linkage between programs and their respective groups within the academic portfolio system.

**Authentication:** Access to this endpoint requires the user to be authenticated. Failure to provide valid authentication details will prevent access to the endpoint functionality.

**Permissions:** Users need to have specific permissions related to viewing or managing academic programs and groups. Without the requisite permissions, the request will not proceed.

The controller for this endpoint initiates by calling the \`getProgramGroups\` method from the \`programs\` core module. This method checks for existing group associations within each program by interacting with the database to retrieve all group links associated with the provided program IDs. It meticulously filters and aggregates the data to ensure that only relevant program-group relationships are considered. After processing, the endpoint compiles the results into a structured format and returns this information to the client, indicating which programs are associated with which groups, thereby facilitating effective academic management and planning.`,
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
