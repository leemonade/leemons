const { schema } = require('./schemas/response/getCurriculumRest');
const { schema: xRequest } = require('./schemas/request/getCurriculumRest');

const openapi = {
  summary: 'Fetch the details of a specific curriculum',
  description: `This endpoint retrieves the full details of a curriculum, including its structure, content, and associated learning nodes based on the provided curriculum identifiers.

**Authentication:** Users need to be authenticated to access the curriculum details. Lack of valid authentication will prevent users from accessing this endpoint.

**Permissions:** Specific permissions are required for a user to access curriculum details. Only users with the appropriate curriculum access level can retrieve the information.

Upon receiving a request, the handler first verifies user authentication and permission levels. If the user is authorized, the handler calls \`curriculumByIds\` method from the curriculum core, which fetches the curriculum data based on its IDs. This process involves querying the database to get detailed curriculum information and its related node levels using the \`nodeLevelsByCurriculum\` method, and constructing the curriculum nodes' tree through the \`nodesTreeByCurriculum\` method. Finally, the curriculum details, including its hierarchical structure and related data, are returned to the user in a structured JSON format.`,
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
