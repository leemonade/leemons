const { schema } = require('./schemas/response/searchNyaActivitiesRest');
const {
  schema: xRequest,
} = require('./schemas/request/searchNyaActivitiesRest');

const openapi = {
  summary: 'Search and retrieve ongoing NYA activities',
  description: `This endpoint is designed to search and retrieve ongoing NYA (New Year Activities) that are assigned to either a teacher or a student, providing a comprehensive overview of educational tasks to manage or participate in. It specifically targets elements such as instances, status, and other relational data to ensure all pertinent information about the activities is included for the users.

**Authentication:** Users need to be authenticated to access the information about ongoing NYA activities. An authentication check is performed to ensure only users with valid sessions can make use of this endpoint.

**Permissions:** This endpoint requires the user to have specific roles or permissions, particularly roles related to educational or teaching activities. Unauthorized access is strictly handled and logged.

The handler begins with verifying user authentication and permissions before proceeding to invoke various methods such as \`getTeacherInstances\`, \`getInstancesData\`, and others from within the \`activitiesData\` and \`filters\` directories. It comprehensively assesses the user's role and the status of requested activities, filtering and sorting data accordingly. The entire process is aimed at delivering tailored and relevant activity data to authenticated and authorized users, from initiation and data processing to forming the final structured response that details the ongoing NYA activities.`,
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
