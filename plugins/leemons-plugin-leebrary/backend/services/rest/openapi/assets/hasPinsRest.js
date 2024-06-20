const { schema } = require('./schemas/response/hasPinsRest');
const { schema: xRequest } = require('./schemas/request/hasPinsRest');

const openapi = {
  summary: 'Check for the existence of digital assets pins related to a user',
  description: `This endpoint checks if any digital asset pins related to a specific user exist in the system, helping to quickly identify user interactions with assets such as likes, bookmarks, or any kind of flags.

**Authentication:** Users need to be logged in to check for pins. If the authentication details are missing or invalid, the request is rejected.

**Permissions:** The user must have the 'view_pins' permission to execute this operation. This ensures that only authorized users can check for their interactions with assets.

Initially, the handler invokes the \`hasPins\` method of the \`Assets\` service, providing user and asset identifiers wrapped in the request context. This method queries the underlying database to verify the existence of any pins associated with the user's account. The operation does not return the pins themselves but rather a boolean indicating the presence or absence of such interactions. Depending on the outcome, the response is structured to inform the client if at least one pin related to the user exists, facilitating efficient frontend decision-making regarding the display of user-specific asset interactions.`,
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
