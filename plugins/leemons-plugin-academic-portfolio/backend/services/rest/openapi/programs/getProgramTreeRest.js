const { schema } = require('./schemas/response/getProgramTreeRest');
const { schema: xRequest } = require('./schemas/request/getProgramTreeRest');

const openapi = {
  summary:
    'Retrieves the hierarchical structure of a specific academic program',
  description: `This endpoint retrieves the full hierarchical tree structure of a specified academic program, including its courses, subjects, and any nested subdivisions related to the academic curriculum. It's designed to provide a comprehensive view of an academic program's layout for educational planning and tracking.

**Authentication:** This endpoint requires users to be authenticated to ensure the security of academic information. Unauthorized access is not permitted, and authentication ensures that only authorized personnel can retrieve program structures.

**Permissions:** Access to this endpoint is restricted to users with the 'view_program_tree' permission. Users without sufficient permissions will be unable to retrieve program structures as part of the platform's role-based access control.

Upon receiving a request, the \`getProgramTreeRest\` handler in the \`programs.rest.js\` file delegates the task to the \`getProgramTree\` service method, which performs the primary logic of constructing the program tree. It utilizes additional methods such as \`getProgramCourses\`, \`getProgramGroups\`, and \`getProgramSubstages\` to gather detailed information about each node in the tree. The \`getTreeNodes\` and \`getTree\` methods from the \`common\` core are used to ensure that the hierarchical data maintains its structure and integrity. All these methods work together to assemble a nested JSON object that represents the program's academic structure. The response is then formatted and returned to the client as a JSON object reflecting the complete tree-like structure of the academic program.`,
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
