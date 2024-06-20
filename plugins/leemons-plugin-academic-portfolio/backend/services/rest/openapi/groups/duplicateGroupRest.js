const { schema } = require('./schemas/response/duplicateGroupRest');
const { schema: xRequest } = require('./schemas/request/duplicateGroupRest');

const openapi = {
  summary: 'Duplicate an academic group',
  description: `This endpoint duplicates a specific academic group along with associated data within the academic portfolio system. The duplication process includes all pertinents details like group configurations, linked courses, and enrolments.

**Authentication:** User authentication is necessary to ensure secure access to the duplication functionality. Without proper authentication, the request will be rejected.

**Permissions:** Users must have 'group_management' permission to execute this operation. This allows only authorized personnel with the right privileges to perform duplications ensuring academic data integrity.

Upon receiving a request, the \`duplicateGroup\` handler from the \`group.rest.js\` file is initiated. This handler first verifies user authentication and permissions. If the user is authenticated and has the necessary permissions, the handler then calls the \`duplicateGroup\` method from the \`groups\` core module. This method manages the duplication logic, which involves deep copying of the group's data and associated entities in the database. Once the duplication is successful, the response includes a confirmation with the details of the newly created duplicate group or an error message if the process fails.`,
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
