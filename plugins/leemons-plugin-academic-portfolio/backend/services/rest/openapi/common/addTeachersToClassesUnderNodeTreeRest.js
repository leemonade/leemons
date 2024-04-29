const {
  schema,
} = require('./schemas/response/addTeachersToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addTeachersToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Assign teachers to classes within a specific node tree',
  description: `This endpoint assigns teachers to all classes that are linked to a specific node tree within the organizational structure of the academic portfolio. The structure and linkage determine where the teachers are needed and which classes they should be associated with.

**Authentication:** This endpoint requires users to be authenticated to ensure that only authorized personnel can assign teachers to classes.

**Permissions:** Users need to have administrative or academic coordinator permissions to access this functionality. The permission checks ensure that only users with the right level of access can make changes to the academic structure.

Upon receiving a request, the endpoint first verifies the user's authentication status and permissions. If the verification is successful, it proceeds to interact with the \`addTeachersToClassesUnderNodeTree\` method in the \`common\` core. This method fetches all classes under the specified node tree and then assigns the designated teachers to these classes. The operation involves multiple database interactions managed through the Moleculer microservices framework to handle the data efficiently and securely. Once the teachers are successfully assigned, the endpoint sends a confirmation response indicating the successful assignment of teachers to the classes.`,
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
