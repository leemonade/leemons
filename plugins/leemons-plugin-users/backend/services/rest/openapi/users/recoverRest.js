const { schema } = require('./schemas/response/recoverRest');
const { schema: xRequest } = require('./schemas/request/recoverRest');

const openapi = {
  summary: 'Initiates user password recovery',
  description: `This endpoint facilitates the password recovery process for users who have forgotten their login credentials. It typically involves the user entering their email address, to which a password reset link is sent if the email is associated with an existing account.

**Authentication:** No prior authentication is required to access this endpoint, making it accessible for users who cannot log in.

**Permissions:** There are no specific permissions required to access this endpoint. However, security measures are in place to ensure that the password reset process is secure and accessible only to the rightful account owner.

Upon receiving a password recovery request, the endpoint validates the provided email address against the users database. If the email is found, the system generates a secure token and sends a password reset email to the corresponding user's email address. This token is typically embedded within a URL provided in the email, allowing the user to reset their password in a secure manner. The process ensures that sensitive user information remains protected throughout, without compromising the ease of access to the recovery feature.`,
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
