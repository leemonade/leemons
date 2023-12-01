const { schema } = require('./schemas/response/programSubstagesRest');
const { schema: xRequest } = require('./schemas/request/programSubstagesRest');

const openapi = {
  summary: 'List all program substages for a specific program',
  description: `This endpoint lists all the substages associated with a particular academic program. It provides an organized view of the program's division into its constituent parts, which may include various stages and substages related to the academic curriculum.

**Authentication:** Users must be authenticated to retrieve program substages. Access without proper authentication will be denied.

**Permissions:** The user is required to have specific permissions relating to academic program access. Only users with the right to view or manage the academic program details will be granted access to the substages.

After the \`programSubstagesRest\` action receives a request, it begins by calling the \`getProgramSubstages\` method defined in the \`programs\` core. This method is responsible for querying the database and retrieving all the substages associated with the given academic program identifier. It carefully checks for user permissions and handles any necessary authorization to ensure that only entitled users can access the data. Once the substages are fetched, the response is constructed to include information about each substage in a structured format, which is then sent back to the client.`,
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
