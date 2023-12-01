const { schema } = require('./schemas/response/postGroupRest');
const { schema: xRequest } = require('./schemas/request/postGroupRest');

const openapi = {
  summary: 'Create a new academic group',
  description: `This endpoint is responsible for creating a new academic group within the platform. It allows authorized users to define and add a group typically representing a class or cohort of students, to the academic organization structure.

**Authentication:** Users need to be authenticated to create a new academic group. The endpoint will reject requests from unauthenticated users.

**Permissions:** Users must have the 'group.create' permission to add a new academic group. Without appropriate permissions, the request will be rejected.

Upon receiving a request, the handler initiates the \`addGroup\` method from the \`groups\` core. This method performs various checks, such as verifying that the provided group information meets the pre-defined validation criteria and ensuring that the group does not already exist within a program. If the validation is successful, the method proceeds to insert the new group information into the database. Finally, the handler returns a success response to the client along with the details of the newly created group if the operation is completed without errors.`,
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
