const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetch user profiles based on specific criteria',
  description: `This endpoint retrieves user profiles according to specific criteria provided. It aims to simplify user management by allowing administrators to view detailed information about user profiles in a filtered manner.

**Authentication:** Users must be authenticated to access this endpoint. Adequate authentication ensures secure access to the user profile data.

**Permissions:** Access is restricted to users who have administrative rights or specific permissions to manage user profiles. The required permissions ensure that only authorized personnel can view or modify user profile data.

The handler for this endpoint begins by calling the \`getProfiles\` method from the \`profiles\` core module. This method processes the request by extracting and validating criteria from the request parameters. After validation, it queries the database to fetch user profiles that match the given criteria. The database transaction is carefully handled to ensure data integrity and security. Upon successful retrieval, the profiles are formatted and returned to the user in JSON format, adhering to the specified data structure guidelines for client-side processing.`,
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
