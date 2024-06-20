const { schema } = require('./schemas/response/addPinRest');
const { schema: xRequest } = require('./schemas/request/addPinRest');

const openapi = {
  summary: "Add a new pin to the user's collection",
  description: `This endpoint allows the authenticated user to add a new pin to their personal collection within the platform. It is primarily designed to help users organize and save items of interest.

**Authentication:** Users need to be logged in to utilize this feature. Access will be denied for any requests without a valid authentication session.

**Permissions:** The user must have the 'add_pin' permission, which allows them to append new pins to their collection. This ensures that only users with the requisite rights can make modifications to their pin collection.

Upon receiving a request, the endpoint first verifies the user's authentication status and permissions. It then proceeds to invoke the \`addPin\` function, passing user-specific data extracted from the request body. This function is responsible for creating a new pin and saving it to the database associated with the user's account. After successful insertion, the response confirms the creation of the new pin along with its details serialized in JSON format, indicating a successful operation.`,
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
