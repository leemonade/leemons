const { schema } = require('./schemas/response/getSubjectCreditsRest');
const { schema: xRequest } = require('./schemas/request/getSubjectCreditsRest');

const openapi = {
  summary: 'Calculates and retrieves credits for a given subject',
  description: `This endpoint is designed to calculate and provide the total number of credits attributed to a specific academic subject. The calculation considers various factors including the academic level, subject requirements, and any special considerations within the academic institution's guidelines.

**Authentication:** Users need to be authenticated to access this endpoint. Without proper authentication, the endpoint will reject the request, ensuring that only authorized personnel can access sensitive academic information.

**Permissions:** This endpoint requires the user to have 'view_academic_credits' permission. Users without this permission will not be able to retrieve credit information, ensuring that access is restricted based on user roles within the educational institution.

Upon receiving a request, the \`getSubjectCreditsRest\` handler in the \`subject.rest.js\` first validates the input parameters to ensure they match the expected format and values. It then calls the \`getSubjectCredits\` method from the \`subjects\` core module. This method performs the necessary calculations and database queries to determine the credit value associated with the subject. The calculated credits are then prepared and returned in the response body as JSON data, providing a clear and concise representation of the subject's credit value.`,
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
