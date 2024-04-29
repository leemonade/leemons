const { schema } = require('./schemas/response/postSubjectRest');
const { schema: xRequest } = require('./schemas/request/postSubjectRest');

const openapi = {
  summary: 'Add new subject to academic portfolio',
  description: `This endpoint is designed to add a new subject to a user's academic portfolio within the Leemonade platform, ensuring that all necessary academic details are accurately recorded.

**Authentication:** Users need to be authenticated to access this endpoint, as it involves sensitive user-specific academic data.

**Permissions:** This endpoint requires that the user has \`academic-write\` permission to allow the addition of academic records.

Upon receiving the API call, the \`postSubjectRest\` handler orchestrates several functions to ensure the subject is correctly added to the database. Initially, it calls \`addSubject\` from the \`subjects\` core module, which is responsible for validating the input data and then inserting the subject details into the database. After the subject is added, the handler may invoke \`setSubjectCredits\` and \`setSubjectInternalId\` for further configuration specific to the academic institution's requirements. The entire process ensures data integrity and adherence to the academic module's rules before responding to the client with a successful operation acknowledgment.`,
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
