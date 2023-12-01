const { schema } = require('./schemas/response/getTemporalSessionsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getTemporalSessionsRest');

const openapi = {
  summary: 'Fetch temporary session data based on user schedules',
  description: `This endpoint is responsible for calculating and retrieving temporary sessions for a user based on their predefined schedule. The sessions include all temporary timeslots that the user needs to be aware of within a specified time frame.

**Authentication:** User authentication is mandatory to ensure that access to temporal session data is granted only to users with valid credentials. Unauthorized access will be blocked.

**Permissions:** Appropriate permissions are required to access this endpoint. Users must have the 'view_temporal_sessions' permission to retrieve the relevant session information.

The 'getTemporalSessionsRest' handler starts by calling the 'getTemporalSessions' function in the 'session/index.js' controller. This function pulls the user's schedule from the database and passes it to the 'calculeSessionsBetweenDatesFromSchedule' method found in 'calculeSessionsBetweenDatesFromSchedule.js'. This method computes the sessions that occur between specific dates according to the schedule. Finally, the 'getTemporalSessions' function returns these calculated sessions, which are then provided to the API consumer in JSON format.`,
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
