const { schema } = require('./schemas/response/subjectsRest');
const { schema: xRequest } = require('./schemas/request/subjectsRest');

const openapi = {
  summary: 'Manage subject-related academic information',
  description: `This endpoint handles the creation, updating, or querying of academic subjects within the educational organization's portfolio. It facilitates the management of subject details that are vital for academic planning and tracking.

**Authentication:** Users must be logged in to interact with the subject management features. Without proper authentication, the system will deny access to the endpoint.

**Permissions:** Appropriate access rights are required to use this endpoint. Users must possess the necessary permissions to create, update, or view academic subject data, depending on the action being performed.

Upon receiving a request, the controller initiates a sequence of operations to handle the specific subject-related action as dictated by the endpoint's design. If the action involves retrieving subject data, the endpoint invokes the \`subjectByIds\` method from the \`subjects\` core module, which retrieves information for one or more subjects based on their IDs. For creation or updating of subject information, the controller triggers corresponding methods capable of manipulating the data in the database. Throughout the process, the controller ensures to validate user permissions, handle authentication, and manage data according to the business logic defined for the academic portfolio management.`,
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
