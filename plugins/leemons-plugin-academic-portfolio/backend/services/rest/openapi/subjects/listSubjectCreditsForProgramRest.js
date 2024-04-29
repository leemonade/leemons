const {
  schema,
} = require('./schemas/response/listSubjectCreditsForProgramRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSubjectCreditsForProgramRest');

const openapi = {
  summary: 'List subject credits for a specific academic program',
  description: `This endpoint lists all subject credits associated with a particular academic program. It is designed to help users understand the credit requirements and the distribution of credits across different subjects within the specified program.

**Authentication:** Users need to be authenticated to access the information about subject credits. Authentication ensures that only authorized users can view sensitive academic program details.

**Permissions:** Users must have the appropriate permissions related to academic management or specific program oversight to access this endpoint. Permissions are checked to verify that the user has adequate rights to view academic program credit distributions.

The process begins by the endpoint receiving a request which includes identifiers for the specific academic program. The handler, \`listSubjectCreditsForProgramRest\`, calls the \`listSubjectCreditsForProgram\` method in the \`subjects\` core module. This method consults the database to retrieve detailed information on all subjects and their associated credits for the given program. The data is then formatted and returned to the user as a structured JSON response, providing a clear breakdown of credits by subject within the program.`,
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
