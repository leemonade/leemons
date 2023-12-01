const { schema } = require('./schemas/response/sendWelcomeEmailToUserRest');
const {
  schema: xRequest,
} = require('./schemas/request/sendWelcomeEmailToUserRest');

const openapi = {
  summary: 'Sends a welcome email to newly registered users',
  description: `This endpoint handles the task of sending a welcome email to users who have recently completed their registration process. The welcome email typically includes details such as an acknowledgment of registration, links for user activation or further information, and additional help or support resources.

**Authentication:** The user is not required to be logged in to receive the welcome email, as this action is part of the onboarding process and occurs immediately after user registration.

**Permissions:** The action does not require explicit permissions since it is triggered as part of the user sign-up workflow. However, it is constrained to be invoked only upon successful creation of a new user account.

Upon invocation, the \`sendWelcomeEmailToUserRest\` handler within the \`users.rest.js\` service file calls the \`sendWelcomeEmailToUser\` method from the \`users\` core module. The method prepares the welcome email content and leverages the email service provider configured for the application to dispatch the email. It personalizes the email with the new user's details and includes any necessary activation links or steps that the user should follow next. The sending process is logged for audit purposes and any errors encountered during email dispatch are handled appropriately. If successful, no content is sent back to the client except for a confirmation of action taken in the response status.`,
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
