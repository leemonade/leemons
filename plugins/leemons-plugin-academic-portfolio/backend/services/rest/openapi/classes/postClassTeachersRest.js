const { schema } = require('./schemas/response/postClassTeachersRest');
const { schema: xRequest } = require('./schemas/request/postClassTeachersRest');

const openapi = {
  summary: 'Assign multiple teachers to a class',
  description: `This endpoint is responsible for mapping multiple teachers to a specific class, ensuring that these teachers are associated with that class in the academic portfolio. This operation is crucial for managing class responsibilities and access for teachers in the educational management system.

**Authentication:** Users need to be authenticated to access and modify the teachers' assignments for classes. An improper or missing authentication will prevent access to this endpoint.

**Permissions:** The user needs to have administrative rights or specific role-based permissions that allow them to manage teacher assignments within classes. These permissions are necessary to ensure that only authorized personnel can make changes to the academic assignments.

Upon receiving a request, the endpoint first validates the user's authentication and authorization levels. Post validation, it invokes methods from the \`Classes\` service, particularly \`addMultipleTeachersToClass\`, which accepts class ID and teacher IDs. This service then interacts with the underlying database to update the class records by associating them with the specified teacher IDs. The process involves checks and balances to ensure that the data integrity is maintained throughout the transaction. Finally, a successful operation will confirm the updated associations via a response, detailing the newly created links between the specified class and its teachers.`,
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
