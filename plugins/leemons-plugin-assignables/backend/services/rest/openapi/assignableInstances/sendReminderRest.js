const { schema } = require('./schemas/response/sendReminderRest');
const { schema: xRequest } = require('./schemas/request/sendReminderRest');

const openapi = {
  summary: 'Send reminder notifications to users',
  description: `This endpoint triggers the process of sending reminder notifications to users regarding their pending assignments. It is specifically designed to handle operations related to reminding users via email or other configured communication channels of upcoming deadlines or actions required on their part.

**Authentication:** User authentication is required to ensure that the reminder notifications are sent only to legitimate and authenticated users within the system.

**Permissions:** Users need to have specific roles or permission levels, typically 'user:read' or 'user:write', to trigger sending reminders. The exact permission required can vary based on the system configuration and the sensitivity of the information being reminded about.

Upon receiving a request, the \`sendReminder\` action in \`instance.rest.js\` initializes the process by calling the \`sendReminder\` method from the \`sendReminder\` core. This method verifies user permissions and authenticates the session before proceeding. If the checks pass, it fetches user data related to the assignments that require reminders. It then formats the reminder messages and utilizes configured communication services to dispatch these reminders to the respective users. The workflow ensures that only users with pending actions and correct permissions receive the reminders, thereby adhering to the system's security protocols.`,
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
