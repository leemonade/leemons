const {
  schema,
} = require('./schemas/response/deleteGroupFromClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/deleteGroupFromClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Deletes a group from all classes within a specified node tree',
  description: `This endpoint is responsible for removing a specified group from all classes that are part of a given node tree hierarchy. The node tree represents organizational structures such as departments, courses, or programs within the academic portfolio platform.

**Authentication:** Users need to be authenticated and have a valid session to perform this operation. The endpoint will reject requests from unauthenticated users.

**Permissions:** Users must have administrative privileges or specific permissions to modify group enrolments within the node tree structure. Without the required permissions, the request will be denied.

Upon receiving a request with the necessary parameters, the handler initiates a process that traverses the node tree to identify all classes where the group is currently enrolled. It leverages the \`removeGroupFromClassesUnderNodeTree\` core method which contains the logic to access the database and update the class enrollments. This method ensures that the group is unenrolled from each class within the node tree while maintaining the integrity of the class lists. Successful execution of this operation results in the group being removed from all classes in the hierarchy, and the endpoint returns a confirmation of the group removal.`,
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
