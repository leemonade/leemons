const { schema } = require('./schemas/response/haveProgramsRest');
const { schema: xRequest } = require('./schemas/request/haveProgramsRest');

const openapi = {
  summary: 'Check availability of academic programs',
  description: `This endpoint checks whether there are any academic programs available in the system. It does not specify the details of the programs, but simply confirms their existence or non-existence.

**Authentication:** Users must be authenticated to enquire about the availability of academic programs. Unauthenticated requests will be denied.

**Permissions:** Users need specific permissions to view the status of academic programs. Without these permissions, the endpoint will not provide any information.

Upon receiving a request, the endpoint accesses the \`havePrograms\` method in the \`programs\` core module. This method queries the system's database to check for any entries under the academic programs category. The process includes validating the user's credentials and permissions before proceeding with the database query. The response from this method will clearly indicate whether academic programs are available or not, without disclosing specific details about the programs.`,
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
