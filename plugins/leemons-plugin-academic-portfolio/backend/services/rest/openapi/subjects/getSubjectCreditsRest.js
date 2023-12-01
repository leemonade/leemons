const { schema } = require('./schemas/response/getSubjectCreditsRest');
const { schema: xRequest } = require('./schemas/request/getSubjectCreditsRest');

const openapi = {
  summary: 'Retrieve subject credits information',
  description: `This endpoint retrieves the credit information for a specific subject within the academic portfolio. It outputs the amount of credits and other relevant details associated with the subject in question.

**Authentication:** User authentication is required to access the subject credit information. An unauthenticated request will be rejected.

**Permissions:** The user must possess the necessary authorization to view academic subject details, which typically involves being part of the educational staff or having an administrative role that permits access to academic records.

Upon receiving a request, the handler begins by invoking the \`getSubjectCredits\` method from the \`subjects\` core module. This method is tasked with retrieving the credit details for the payload's specified subject, which involves querying the academic portfolio's database for the subject's credit allocation. The method processes the request context (\`ctx\`) which includes input parameters, and the user's authentication and permission data. Once the database query resolves with the subject's credit information, the endpoint constructs an appropriate response that encapsulates this data in a structured format. The response is then returned as a JSON object containing the subject credits, ensuring the client-side receives comprehensible and actionable information.`,
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
