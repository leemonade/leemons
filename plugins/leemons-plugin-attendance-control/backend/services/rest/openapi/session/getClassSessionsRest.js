const { schema } = require('./schemas/response/getClassSessionsRest');
const { schema: xRequest } = require('./schemas/request/getClassSessionsRest');

const openapi = {
  summary: 'Calculate and fetch session data for class schedules',
  description: `This endpoint calculates and retrieves session data between specified dates based on the class schedules. It handles the task of mapping out all class sessions that fall within the given date range and according to the pre-defined class schedules in the system.

**Authentication:** Users must be authenticated to request the session information. Without proper authentication, the endpoint will deny access to the data.

**Permissions:** This endpoint requires the user to have 'view_sessions' permission. Users lacking this permission will not be able to retrieve any session data.

The controller begins by invoking the \`calculeSessionsBetweenDatesFromSchedule\` method from the \`Sessions\` core, which takes in parameters for start and end dates, along with the schedule identifiers. This method computes all possible session occurrences within the provided dates and aligns them based on the class schedules. Once this calculation is complete, the result - a list of session times and details - is formatted and sent back through the response in JSON format, encompassing all sessions applicable within the specified date range.`,
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
