const { schema } = require('./schemas/response/profileTokenRest');
const { schema: xRequest } = require('./schemas/request/profileTokenRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Generate a token for a specific user profile",
  "description": "This endpoint generates a unique token associated with a user's profile, which is typically used for single sign-on (SSO) or similar authentication mechanisms that require secure, temporary access to a user-specific resource or session.

**Authentication:** Users must be authenticated to request a profile-specific token. An authentication failure will prevent access to this endpoint.

**Permissions:** The user must have appropriate permissions to generate tokens for the requested profile, ensuring that only authorized actions are performed through this endpoint.

Upon receiving a request, the handler begins by validating the authenticated user's credentials and permissions. It then calls the underlying function \`profileToken\` from the users' core logic with necessary parameters like the user ID and profile information. This function orchestrates the generation of the token, which might involve cryptographic operations for ensuring the token's security and uniqueness. Once the token is generated, it is sent back to the client in the response body. The entire flow ensures that only valid and authorized requests result in the creation of a profile token."
}
`,
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
