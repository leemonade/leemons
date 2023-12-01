const { schema } = require('./schemas/response/postClassRest');
const { schema: xRequest } = require('./schemas/request/postClassRest');

const openapi = {
  summary: 'Create a new class in the academic program',
  description: `This endpoint facilitates the creation of a new class within the context of an academic program. The class is defined by various attributes such as its name, schedule, associated teacher(s), and student group, and is integrated into the academic program's structure, ensuring that it aligns with the curriculum and semester planning.

**Authentication:** Users need to have valid credentials to access this endpoint. Only authenticated users can create new classes within the academic portfolio.

**Permissions:** The user must possess the necessary role-based permissions to add classes to an academic program. Typically, this action is restricted to academic administrators or staff with specific access rights to academic program management functions.

Upon receiving the request, the \`postClassRest\` handler initiates a series of validations to ensure that the new class abides by the program's constraints and policies. It calls \`addClass\` from the academic portfolio backend core class logic, which performs the necessary checks on teacher availability, class scheduling conflicts, and student group assignment. Should all criteria be met, the class is then persisted to the database through the core class's methods. The flow concludes with a response back to the client, detailing the newly created class or providing error messages in case issues arose during the class creation process.`,
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
