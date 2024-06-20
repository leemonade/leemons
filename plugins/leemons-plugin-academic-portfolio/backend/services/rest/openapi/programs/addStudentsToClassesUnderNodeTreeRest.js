const {
  schema,
} = require('./schemas/response/addStudentsToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addStudentsToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Add students to classes linked with specific program node trees',
  description: `This endpoint facilitates the dynamic enrollment of students into classes that fall under a given program's node tree structure. It primarily handles the automation of student-class assignments based on the hierarchical definitions and dependencies within the program nodes.

**Authentication:** User authentication is required to ensure that only authorized personnel can manage and carry out student enrolments. An unauthorized, or improperly authenticated request will be denied access.

**Permissions:** This action requires administrative permissions related to student management and program modifications. Only users with the necessary permissions can execute additions of students to classes.

The process starts by accepting a request which specifies the particular node tree and the students targeted for enrollment. It then invokes the \`addStudentsToClassesUnderNodeTree\` method, defined in the \`backend/core/programs\` directory. This method examines the node tree to delineate the classes affected. Subsequently, it iterates over the list of students, enrolling each into the appropriate classes defined under the node tree hierarchy. The entire operation is transactional, ensuring that all enrollments are either completed successfully or rolled back in case of an error, maintaining data integrity throughout the process.`,
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
