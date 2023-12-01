const { schema } = require('./schemas/response/dropDBRest');
const { schema: xRequest } = require('./schemas/request/dropDBRest');

const openapi = {
  summary: "Deletes all data from the platform's database",
  description: `This endpoint is responsible for purging all records stored within the platform's database. This is an irreversible action designed to be used in situations such as resetting the platform for a new installation or clearing all data during testing phases.

**Authentication:** Due to the sensitive nature of this endpoint, a user must be authenticated with superadmin privileges to initiate the database drop. Any request lacking proper authentication will be denied to prevent unauthorized data destruction.

**Permissions:** **Superadmin** permissions are required to execute this endpoint. This is to ensure that only users with the highest level of access rights can perform such a critical operation, as it affects all data and users on the platform.

Upon invocation, the \`dropDBRest\` handler calls internal methods to perform a complete wipe of the database. This includes dropping tables or collections, and cleaning up any associated resources. It is typically followed by a series of checks to confirm that the database has been cleared successfully. The response to the client will reflect the result of the operation, with details on success or failure of the data deletion process.`,
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
