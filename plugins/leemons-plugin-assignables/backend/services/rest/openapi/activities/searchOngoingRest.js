const { schema } = require('./schemas/response/searchOngoingRest');
const { schema: xRequest } = require('./schemas/request/searchOngoingRest');

const openapi = {
  summary: 'Search for ongoing assignable activities',
  description: `This endpoint allows users to search for ongoing activities that are assignable. The activities retrieved by this endpoint are those that are currently active and targeted towards the user's role, such as homework, projects, and other tasks within educational programs.

**Authentication:** Users must be authenticated to perform this search. Without a valid session, the endpoint will not provide any activity data.

**Permissions:** Users require specific roles or permission sets that grant access to view ongoing activities. For example, a student role may be required to view assignments, or a teacher role may be necessary to view activities assigned to their students.

Upon receiving a request, the \`searchOngoingActivities\` handler is called, which orchestrates several steps to provide a response. Initially, it collects filtering parameters from the request such as deadlines, progress, and user-specific queries. It then uses auxiliary functions like \`getInstanceSubjectsProgramsAndClasses\`, \`getStudentAssignations\`, \`getInstancesData\`, \`getAssignablesData\`, etc., to collate relevant data about the activities from various sources, including activity dates, associated subjects, assignation statuses, and any related assets. Post data aggregation, additional helper functions like \`filterAssignationsByDaysUntilDeadline\` and \`sortInstancesByDates\` are employed to fine-tune the response list based on user roles, status, and more. These functions filter and sort the data accordingly, ensuring the output is both precise and contextually relevant for the requesting user. The final response includes a list of ongoing activities structured as a JSON payload, which the frontend can utilize to display the activities to the user.`,
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
