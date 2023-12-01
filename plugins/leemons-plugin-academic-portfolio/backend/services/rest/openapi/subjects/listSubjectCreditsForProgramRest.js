const {
  schema,
} = require('./schemas/response/listSubjectCreditsForProgramRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSubjectCreditsForProgramRest');

const openapi = {
  summary: 'List subject credits for a specific program',
  description: `This endpoint lists all the subject credits associated with a given academic program. It helps in understanding the credit structure and distribution for subjects within the program.

**Authentication:** Users need to be authenticated to access the list of subject credits for a program. Unauthenticated requests will be rejected.

**Permissions:** Users must have the necessary permissions to view the academic portfolio details, including subject credit information for the program in question.

Upon receiving a request, the handler initiates the procession by calling the \`listSubjectCreditsForProgram' method defined in the 'subjects' core module. This method receives parameters identifying the specific academic program and then carries out a query to the underlying data storage to retrieve a detailed list of all subjects and their associated credits as per the program's curriculum. Once the data is fetched, it is formatted as needed before being sent back in the response body in JSON format to the requester, detailing the credit requisites for each subject within the specified program.`,
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
