const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Provides detailed user profile information',
  description: `This endpoint retrieves detailed information about a user's profile based on the provided user ID. The details include various attributes such as name, email, roles, and associated permissions within the system.

**Authentication:** User authentication is required to access this endpoint. A valid session token must be provided in the request header to verify the user's identity and session validity.

**Permissions:** The user needs to have the 'view_profile' permission to retrieve detailed user information. Access without sufficient permissions will lead to a denial of the request.

Upon receiving the request, the server handler first checks for a valid session token and then proceeds to verify if the logged-in user has the necessary permissions to view user profiles. If these checks pass, the 'getUserDetails' method from the user management service is called with the user ID extracted from the request path. This method interacts with the database to fetch all relevant information about the user. The final response includes a comprehensive JSON object containing all the details of the user's profile.`,
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
