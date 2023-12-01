const { schema } = require('./schemas/response/sendReminderRest');
const { schema: xRequest } = require('./schemas/request/sendReminderRest');

const openapi = {
  summary: 'Send reminder notifications for pending assignables',
  description: `This endpoint triggers the sending of reminder notifications to users about pending assignments or tasks within an assignable instance. By invoking this endpoint, the system will process the pending actions for each user and send out notifications accordingly.

**Authentication:** Users must be authenticated to trigger reminder notifications. Without proper authentication, the request will be rejected.

**Permissions:** Users need specific permissions to send reminders. Only users with the 'send_reminder' permission on the assignable instance are authorized to perform this action.

Upon receiving the request, the \`sendReminderRest\` action first validates the user's authentication status and checks if the user has the appropriate permissions to send reminders. It then calls the \`sendReminder\` method which handles the retrieval of pending assignables for the user. The method constructs reminder notifications based on the assignments' due dates and details. Lastly, the \`sendEmail\` method is utilized to dispatch the notifications via email to the users, ensuring they are aware of their pending tasks. The full process aims to streamline user engagement and efficiency in managing assignables.`,
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
