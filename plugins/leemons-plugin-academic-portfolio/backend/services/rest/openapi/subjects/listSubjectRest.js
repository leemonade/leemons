const { schema } = require('./schemas/response/listSubjectRest');
const { schema: xRequest } = require('./schemas/request/listSubjectRest');

const openapi = {
  summary: 'List all subjects in the academic portfolio',
  description: `This endpoint lists all subjects that are part of the academic portfolio managed by the system. It allows retrieval of the subjects with details relevant to academic administration and planning.

**Authentication:** Users must be authenticated to retrieve the list of subjects. Unauthenticated requests will not be permitted to access the subject list.

**Permissions:** Users are required to have the 'list_subjects' permission to access this endpoint. Without appropriate permissions, access to the subject data will be denied.

This controller handler begins by receiving a request to list subjects. The process includes calling the \`listSubjects\` function from the \`subjects\` core module, which fetches the relevant data from the database. This retrieval includes sorting and filtering subjects based on provided criteria if any. The result of the \`listSubjects\` operation is then formatted as needed for the response before being sent back to the user in a structured JSON format, typically an array of subject objects. During this flow, error handling mechanisms ensure that any issues during database access or data processing are captured and appropriately relayed to the user.`,
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
