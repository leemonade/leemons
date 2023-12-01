const { schema } = require('./schemas/response/putGroupRest');
const { schema: xRequest } = require('./schemas/request/putGroupRest');

const openapi = {
  summary: 'Update existing academic group information',
  description: `This endpoint updates the details of a specific academic group identified by a unique identifier. The modifications can include changes to the group's name, its associated curriculum, or the adjusting of member roles within the group.

**Authentication:** The user must be authenticated to modify group information. An attempt to access this endpoint without a valid authentication token will be rejected.

**Permissions:** Updating group details requires the user to have specific roles or permissions set in the system, typically 'group_edit' or an equivalent administrative privilege.

Upon receiving a request, the handler initializes by validating the incoming JSON payload against a predefined schema to ensure necessary fields are present and correctly formatted. Once validation passes, it then calls the core \`updateGroup\` function located in '.../core/groups/updateGroup.js', providing the group's ID and the data to be updated. Internally, this core function may execute multiple database transactions, handling relationships and constraints within the group's model. After successful completion of the core function, the endpoint responds with the updated group data or an appropriate error message detailing why the update could not be performed.`,
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
