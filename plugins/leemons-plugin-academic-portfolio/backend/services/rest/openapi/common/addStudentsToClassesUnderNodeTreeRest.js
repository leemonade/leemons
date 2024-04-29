const {
  schema,
} = require('./schemas/response/addStudentsToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addStudentsToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Adds students to classes under a specified node tree',
  description: `This endpoint is designed to add students to specified classes found under a node tree in the academic portfolio system. The process involves identifying the classes linked to a given node tree and updating those classes with new student enrolments.

**Authentication:** Users need to be authenticated to perform this operation. Access to this endpoint is controlled by an authentication mechanism that verifies the user's identity and session validity before proceeding.

**Permissions:** The user must have 'academic_admin' role or specific permission 'manage_classes_students' to execute this operation. Attempting to use this endpoint without adequate permissions will result in access being denied.

The operation initiated by this endpoint starts with fetching the classes associated with the specified node tree. This is typically achieved by invoking the \`getClassesUnderNodeTree\` method which queries the database to retrieve all relevant class entries. Subsequently, the endpoint proceeds to add students to these classes by utilizing a batch update method, ensuring all specified students are correctly registered across the identified classes. This comprehensive method handles both the verification of class existence and the validity of student IDs before finalizing the enrolment, thereby maintaining data integrity and operational coherence within the system.`,
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
