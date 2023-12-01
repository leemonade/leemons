const { schema } = require('./schemas/response/postClassStudentsRest');
const { schema: xRequest } = require('./schemas/request/postClassStudentsRest');

const openapi = {
  summary: 'Assign multiple students to a class',
  description: `This endpoint is responsible for adding a batch of students to a specified class within the academic portfolio system. The operation ensures that each student in the submitted list is associated with the given class, facilitating the management of class rosters and relevant academic activities.

**Authentication:** User authentication is required to associate students with a class. Only authenticated users can perform this action to maintain the integrity and security of academic data.

**Permissions:** Users must have the necessary permissions to modify class rosters. Typically, this would include administrative staff or educators with the authority to manage student placements within classes.

The controller starts by validating the received student and class IDs to ensure accuracy and relevance. It then calls upon the \`addClassStudentsMany\` method in the \`class\` core, which processes each student's ID and associates them with the provided class ID in the system's database. The method handles the many-to-many relationship between students and classes, updating the enrollment records accordingly. Finally, it returns a success message upon completing the operation, potentially with details of any students who could not be associated with the class.`,
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
