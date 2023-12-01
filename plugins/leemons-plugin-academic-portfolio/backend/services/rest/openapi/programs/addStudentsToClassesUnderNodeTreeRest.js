const {
  schema,
} = require('./schemas/response/addStudentsToClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/addStudentsToClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Add students to all relevant classes under a node tree',
  description: `This endpoint is designed to assign students to all classes that are relevant to them, based on their position in the academic structure's node tree. Specifically, it takes into account the hierarchical organization of programs, courses, and classes within an educational institution's framework to ensure that students are added to classes that correspond with their academic pathway.

**Authentication:** Users must be authenticated in order to assign students to classes. Without a proper authentication token, the request will be rejected.

**Permissions:** This endpoint requires specific academic permissions, as it alters the enrollment of students in classes. The user must have the authority to modify class memberships and student enrollments.

The process initiated by this endpoint involves several steps to correctly allocate students. Firstly, it identifies the node tree structure that corresponds to the program in which the students are enrolled. It then traverses the tree, discovering all the classes under that node that the students should be a part of. Utilizing the \`addStudentsToClassesUnderNodeTree\` core method, it then iterates over these classes and enrolls the students. This is a multi-step procedure that involves interactions with both the academic portfolio's internal logic and potentially the database, as the core method updates records to associate students with their new classes. The response is detailed, reflecting the outcome of these additions—namely, the classes to which students were added and any errors encountered during the process.`,
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
