const { schema } = require('./schemas/response/addEventRest');
const { schema: xRequest } = require('./schemas/request/addEventRest');

const openapi = {
  summary: 'Adds a new event to the calendar',
  description: `This endpoint allows users to add a new event to the calendar system. The operation includes creating an event entry in the database and may involve notifications to other users based on the event details provided.

**Authentication:** User authentication is required to ensure the security of the event data. Only authenticated users can add events.

**Permissions:** Users need to have event creation privileges. Specific roles or permissions must be checked before allowing a user to create an event.

Upon receiving a request to create an event, the \`addEventRest\` handler calls the \`addFromUser\` method in the events core module which processes the user's data along with the event information. It checks for necessary permissions and authentication status of the user. Following validation, it proceeds to add the event data into the calendar's database. If the event creation involves notifying other users, the \`addToCalendar\` method in the notifications core module is triggered, managing the notification logic as per the defined settings.`,
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
