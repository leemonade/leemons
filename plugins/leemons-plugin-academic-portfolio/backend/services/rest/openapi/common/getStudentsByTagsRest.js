const { schema } = require('./schemas/response/getStudentsByTagsRest');
const { schema: xRequest } = require('./schemas/request/getStudentsByTagsRest');

const openapi = {
  summary: 'Fetch students associated with specified tags',
  description: `This endpoint fetches a list of students who are associated with a set of specified tags. It is primarily used in academic portfolio management systems to categorize and retrieve students based on specific criteria represented by tags.

**Authentication:** Users must be authenticated to query students by tags. Unauthenticated access will result in denial of service.

**Permissions:** This endpoint requires the user to have administrative rights or specific permissions that allow access to student data based on tags. Without the appropriate permissions, the request will be rejected.

The controller starts by validating the incoming request to ensure that it contains valid tags. It then calls the \`getStudentsByTags\` method in the \`common\` core, which performs a database query to retrieve all students matching the specified tags. This method utilizes complex query parameters to accurately filter the students' data according to the provided tags. Once the data is fetched, it's formatted and returned as a JSON array in the HTTP response, providing a comprehensive list of students tailored to the query parameters.`,
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
