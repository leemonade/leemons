const { schema } = require('./schemas/response/addCalendarConfigRest');
const { schema: xRequest } = require('./schemas/request/addCalendarConfigRest');

const openapi = {
  summary: 'Add a new calendar configuration',
  description: `This endpoint enables the creation of a new calendar configuration within the system. It allows for setting up various properties and rules associated with specific calendars, enhancing the customization and functionality for users.

**Authentication:** Users must be authenticated to access this endpoint. This ensures that only logged-in users can create new calendar configurations, providing a level of security and user data integrity.

**Permissions:** The user needs to have 'calendar_create' permission to execute this action. This requirement ensures that only users with the necessary rights can make changes to the calendar configurations.

After receiving the request, the \`addCalendarConfigRest\` handler initiates a process to validate the provided data against predefined schemas. If the data is valid, it calls the \`add\` method from the \`calendar-configs\` core module which interacts with the database to insert new configuration records. This process includes error handling to manage any issues that arise during the database operation. Upon successful creation, a confirmation response is generated and sent back to the user.`,
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
