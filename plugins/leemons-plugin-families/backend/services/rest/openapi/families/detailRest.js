const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Provides detailed information about a specific family entity',
  description: `This endpoint is designed for retrieving detailed data regarding a specific family entity within the application. It encapsulates comprehensive information about the family including its members and associated profiles.

**Authentication:** Authorized access is mandatory, requiring users to be authenticated in order to retrieve family details. Unauthenticated requests will be denied.

**Permissions:** This endpoint requires the user to have explicit permissions to view family information. Observing privacy and security standards, only permitted users, such as family members or authorized administrative personnel, can access the details.

Upon receiving a request, the \`detailRest\` handler calls the \`detail\` function from the 'families' module. The function uses the provided family ID to fetch all relevant data from the database including membership information and other relevant attributes of the family entity. It processes this data to construct a detailed view of the family, considering user permissions and authentication status to manage data visibility. The result is a structured JSON object representing the detailed family profile, which is then returned to the client as the response payload.`,
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
