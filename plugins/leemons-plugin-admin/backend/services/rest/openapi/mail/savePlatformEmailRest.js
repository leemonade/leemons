const { schema } = require('./schemas/response/savePlatformEmailRest');
const { schema: xRequest } = require('./schemas/request/savePlatformEmailRest');

const openapi = {
  summary: 'Save platform-specific email configuration',
  description: `This endpoint saves or updates the email configuration specific to a platform. It handles the creation or modification of settings such as SMTP server details, port, and authentication methods used for sending emails from the platform.

**Authentication:** User authentication is required to access this endpoint. Unauthorized access is prevented, and a valid user session must be established.

**Permissions:** This endpoint requires administrative permissions. Only users with administrative rights can modify email settings.

Upon receiving a request, the \`savePlatformEmailRest\` handler first validates the provided data against predefined schemas to ensure they meet the platform's requirements for email configurations. If the validation passes, it proceeds to either update the existing email settings or create new ones if they do not already exist. This involves interacting with the platform's underlying database to store these configurations securely. Finally, a response is generated and sent back to the client indicating the success or failure of the operation, along with any relevant error messages if applicable.`,
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
