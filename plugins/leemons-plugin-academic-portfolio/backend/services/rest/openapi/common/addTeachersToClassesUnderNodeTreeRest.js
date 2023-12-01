const {
  schema,
} = require('./schemas/response/addTeachersToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addTeachersToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Associate teachers with classes in a node tree hierarchy',
  description: `This endpoint is responsible for associating a group of teachers with classes that belong to a specific node in the organization’s hierarchical tree. It efficiently assigns teachers to multiple classes within the node tree, facilitating bulk operations and ensuring that educators are linked to the appropriate educational structures.

**Authentication:** Users need to be authenticated to perform this action. The endpoint validates the user's credentials before proceeding with the teacher-class associations.

**Permissions:** The user must have administrative privileges or specific access rights to associate teachers with classes. Without the correct permissions, the attempt to assign teachers will be rejected.

Upon receiving a request, the \`addTeachersToClassesUnderNodeTreeRest\` action triggers the \`addTeachersToClassesUnderNodeTree\` method within the \`common\` core service. This method first retrieves all relevant classes underneath the specified node in the organizational tree through \`getClassesUnderNodeTree\`. Then for each class within the node tree, the method iterates and associates the provided list of teacher IDs by updating the data storage with the new relations. Once all teachers are successfully added to their respective classes, the system responds with a confirmation of the executed changes or details of any encountered errors during the process.`,
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
