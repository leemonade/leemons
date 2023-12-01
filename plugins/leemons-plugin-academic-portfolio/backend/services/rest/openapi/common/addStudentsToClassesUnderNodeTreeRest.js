const {
  schema,
} = require('./schemas/response/addStudentsToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addStudentsToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Adds students to classes within a specified node tree',
  description: `This endpoint allows for the addition of students to classes that are part of a certain node tree structure. It takes a specified node id and adds the provided list of student ids to all classes under that node tree, ensuring the students are enrolled in the appropriate classes associated with the node structure.

**Authentication:** This operation requires users to be authenticated. Without proper authentication, users will not be able to perform this action and will receive an error.

**Permissions:** Users must have the necessary permissions to manage class enrollment. Without the appropriate permissions, the request to enroll students will be rejected and the user will be informed of insufficient permissions.

Upon receiving a request, the handler starts by invoking the \`addStudentsToClassesUnderNodeTree\` method which is responsible for the orchestration of necessary actions to fulfill this task. The method will first identify all classes within the given node tree structure by calling \`getClassesUnderNodeTree\` from the \`common\` core. Then, for each identified class, it will verify if the user has the authority to add students by consulting the relevant permission checks. Upon successful authorization, it will add each student to the classes by updating the class rosters respectively. After all students are added to their respective classes, a response is generated indicating the successful enrollment, providing a summary of the operation's outcome.`,
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
