const { schema } = require('./schemas/response/searchOngoingRest');
const { schema: xRequest } = require('./schemas/request/searchOngoingRest');

const openapi = {
  summary: 'Search and compile ongoing activities for a user',
  description: `This endpoint searches and compiles a list of ongoing activities that are relevant to the logged-in user. The main function is to provide an organized view of activities like assignments or projects that are currently active and require the user's attention or action.

**Authentication:** User authentication is required to access this endpoint. It ensures that the data returned is specific to the authenticated user and their permissions.

**Permissions:** The user must have the appropriate permissions to view activities. This typically includes being part of certain user groups or roles that have access to specific modules or activities within the system.

The controller initializes by invoking the \`searchOngoingActivities\` method which aggregates data across different tables to collate ongoing activities. This process involves filtering activities based on their deadlines, grouping them by modules if applicable, and applying pagination through offsets and limits to manage the data volume returned. Each activity's details, including start and end dates, are processed to ensure that users receive timely and relevant information tailored to their role and permissions in the system.`,
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
