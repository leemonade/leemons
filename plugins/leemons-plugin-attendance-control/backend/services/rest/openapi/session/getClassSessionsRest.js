const { schema } = require('./schemas/response/getClassSessionsRest');
const { schema: xRequest } = require('./schemas/request/getClassSessionsRest');

const openapi = {
  summary: 'Get class sessions within a specific date range',
  description: `This endpoint retrieves the class sessions within a specified time frame and is typically used for displaying a class's attendance calendar or generating attendance-related reports.

**Authentication:** Users need to be authenticated to request class session information. Unauthenticated requests will result in a denial of access.

**Permissions:** This endpoint requires the user to have the 'view_class_sessions' permission. Users without the required permission will not be able to retrieve class session data.

Upon receiving a request, the endpoint calls the \`getClassSessions\` method from the \`Session\` service. This method then utilizes the \`calculeSessionsBetweenDatesFromSchedule\` function to calculate and fetch all relevant class sessions that fall between the provided start and end dates. The process involves cross-referencing the class schedule with the requested date range and resolving any temporal (one-time) sessions or modifications through the \`getTemporalSessions\` function, ensuring the final data reflects any exceptional changes to the regular schedule. The result is formatted and returned to the user in a structured JSON response, providing comprehensive details on the class sessions within the specified period.`,
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
