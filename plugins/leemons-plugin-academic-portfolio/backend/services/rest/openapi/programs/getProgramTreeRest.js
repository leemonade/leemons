const { schema } = require('./schemas/response/getProgramTreeRest');
const { schema: xRequest } = require('./schemas/request/getProgramTreeRest');

const openapi = {
  summary: 'Fetch the hierarchical structure of academic programs',
  description: `This endpoint retrieves the hierarchical tree structure representing the organization of academic programs, detailing each level from general program categorizations down to specific subjects. The tree format aids in visualizing the relationship and dependency among various components of the programs.

**Authentication:** Access requires users to be authenticated to ensure data security and integrity. Users must provide valid session tokens to proceed with data retrieval.

**Permissions:** Users must have 'view_program' permissions to access this data. Attempting to access the endpoint without adequate permissions will result in an authorization error.

Upon receiving a request, the endpoint first verifies the user's authentication and permissions. If the checks pass, it proceeds to call the method \`getProgramTree\` from the core 'programs' module. This method consults the database to gather comprehensive details of all academic program elements, organized in a hierarchical tree structure. The result encapsulates the relationships and dependencies in the program, aiming to provide a clear and useful representation for academic administration purposes. Each node in the tree typically represents a different level or component within the overall program structure, starting from general categories and moving down to specific courses and subjects.`,
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
