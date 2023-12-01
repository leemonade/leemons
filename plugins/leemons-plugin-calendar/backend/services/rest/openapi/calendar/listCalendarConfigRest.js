const { schema } = require('./schemas/response/listCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/listCalendarConfigRest');

const openapi = {
  summary: 'List Calendar Configurations',
  description: `This endpoint retrieves a collection of calendar configurations. Each configuration includes details such as the name of the calendar, its associated events, and any specific settings that apply to how the calendar operates within the system.

**Authentication:** Users need to be authenticated to request the list of calendar configurations. Requests without proper authentication will be rejected.

**Permissions:** Users must have the 'list_calendar_configs' permission to access this information. Without the required permissions, access to the calendar configurations will be denied.

This endpoint initiates by calling the \`list\` method from the \`CalendarConfigs\` core, which encapsulates the logic for fetching calendar configurations from the system's datastore. The method is expected to be designed to query the datastore with filters if necessary, and to construct an array of calendar configuration entities. This array encompasses all of the relevant details that the requesting user is authorized to view. Once retrieved, the data is sent back to the client through the Moleculer framework's context as a resolved promise, formatted as a JSON object array, to provide a comprehensive list of calendar configurations.`,
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
