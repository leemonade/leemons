const { schema } = require('./schemas/response/getTreeRest');
const { schema: xRequest } = require('./schemas/request/getTreeRest');

const openapi = {
  summary: 'Generate a hierarchical tree structure for academic entities',
  description: `This endpoint generates a comprehensive hierarchical tree structure representing various academic entities such as courses, programs, and subjects within the platform. This structured output is aimed at providing a clear and navigable visual representation for users, facilitating easier academic planning and management.

**Authentication:** User authentication is mandatory to access this endpoint. Proper credentials need to be provided to ensure authorized access, and failure to authenticate will restrict the user's access to the endpoint.

**Permissions:** Adequate permissions are required to access different levels of academic information. Depending on the user's role (e.g., student, instructor, administrator), permissions will dictate the visibility and interactability with the hierarchical structure.

From the initial request to the response, this handler starts by invoking several lower-level methods to gather necessary data about programs, courses, and subjects from the database. This data is then processed to form a nested hierarchical tree structure. Each node in the tree is created by respective methods such as \`getProgramCourses\`, \`getProgramSubjects\`, which fetch and organize data based on the relationship between academic entities. The response from this handler is a well-structured JSON object that provides clients with a ready-to-use hierarchical view of all academic entities relevant to the user based on their permissions and roles.`,
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
