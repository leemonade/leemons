const { schema } = require('./schemas/response/getTemporalSessionsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getTemporalSessionsRest');

const openapi = {
  summary: 'Calculate temporal session intervals based on a user schedule',
  description: `This endpoint calculates and retrieves all temporal session intervals for a specific user based on their defined schedule within a given date range. The functionality is crucial for planning and managing attendance in educational or organizational settings.

**Authentication:** Users must be authenticated to access this functionality. An active session is required, and the user's credentials are verified against the session information stored on the server.

**Permissions:** The user needs to have 'view_schedule' permission to retrieve and calculate session intervals. This permission ensures that only authorized users can access schedule-related data and operations.

The endpoint begins by invoking the \`calculeSessionsBetweenDatesFromSchedule\` method from the \`Session\` core, which is designed to compute all possible session intervals within the specified dates based on the user's schedule. This method internally handles the complexity of intersecting user-specific schedules with general availability and predefined constraints. The computed data is then formatted and returned as a JSON response, providing a structured list of calculated session intervals for the requested dates.`,
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
