const { schema } = require('./schemas/response/postSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/postSubjectTypeRest');

const openapi = {
  summary: 'Adds a new subject type to the academic portfolio',
  description: `This endpoint allows for the addition of a new subject type into the academic portfolio system. The subject type could represent different categories or classifications of subjects within an academic institution.

**Authentication:** Users must be authenticated and have a valid session to interact with this endpoint. Unauthorized attempts will result in denial of access.

**Permissions:** A user needs to have administrative rights or specific permissions to manage academic portfolio settings in order to add new subject types. Without these permissions, the user's request will be rejected.

Upon receiving a request, the endpoint executes the \`addSubjectType\` action, which typically involves validating the provided subject type data against predefined schemas and ensuring that all required information is present. Assuming validation passes, it then persists the new subject type into the system's datastore using a dedicated method, such as \`saveSubjectType\`, from the academic portfolio's core functionality. The response back to the client will confirm the successful creation of the subject type or provide an error message detailing any issues encountered during the process.`,
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
