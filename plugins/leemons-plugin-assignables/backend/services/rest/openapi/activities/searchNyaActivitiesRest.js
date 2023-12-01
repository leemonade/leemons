const { schema } = require('./schemas/response/searchNyaActivitiesRest');
const {
  schema: xRequest,
} = require('./schemas/request/searchNyaActivitiesRest');

const openapi = {
  summary: 'Search New York Academy Activities',
  description: `This endpoint performs a search for all the activities related to the New York Academy (NYA) that the requesting user is associated with, whether as a student or a teacher. The activities include assignments, classes, and educational materials tailored to the user's role and permissions within the NYA.

**Authentication:** Users must be authenticated and have a valid session to make requests to this endpoint. Unauthenticated requests or those with expired sessions will be rejected.

**Permissions:** The endpoint requires that the user has proper authorization to access the NYA activities data. Typically, this might involve roles such as 'student', 'teacher', or 'administrator'. Access will be denied if the user does not hold any of these roles or equivalent permissions within the NYA scope.

Upon request, the \`searchNyaActivitiesRest\` handler interacts with multiple backend services to aggregate activities data. Initially, it invokes \`searchNyaActivities\`, a core function responsible for gathering sortable and filterable lists of activities based on the user's role and access rights. Subsequent helper functions like \`getTeacherInstances\`, \`getInstancesData\`, and \`getAssignablesData\` provide finely-tuned data, focusing on specifics such as teacher-associated instances, activity details, assignable learning materials, etc. The endpoint then applies appropriate filters and sorting mechanisms through helpers such as \`filterInstancesByStudentCompletionPercentage\` and \`sortInstancesByDates\`. After all relevant data is compiled and ordered, the handler wraps the results in a standardized format and sends it back in the HTTP response, providing clients with a comprehensive view of NYA activities targeted to the user's profile.`,
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
