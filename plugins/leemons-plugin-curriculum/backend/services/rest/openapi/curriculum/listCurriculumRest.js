const { schema } = require('./schemas/response/listCurriculumRest');
const { schema: xRequest } = require('./schemas/request/listCurriculumRest');

const openapi = {
  summary: 'List all curriculums available in the system',
  description: `This endpoint lists all curriculums configured within the Leemons platform. It provides a comprehensive overview of the curriculum structures that are available for educational institutions to manage and utilize in their educational offerings.

**Authentication:** Users must be authenticated to access the list of curriculums. Access to this endpoint requires valid user credentials, which are verified through the platform's authentication system. An invalid or missing authentication token will lead to access denial.

**Permissions:** Appropriate permissions are required to view the list of curriculums. The user must have curriculum management roles or specific permissions that allow them to visualize curriculum configurations.

After authentication, the \`listCurriculums\` method in the \`curriculum\` core is called. This method is responsible for querying the database for all curriculums and their relevant details such as titles, scopes, and applicable educational standards. The flow involves retrieving these data entries and formatting them into a structured response that the front end can display. The actual data handling includes sorting and potentially filtering curriculums based on user permissions and roles, ensuring that users receive content appropriate to their access rights. The response is then delivered in JSON format listing the curriculums.`,
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
