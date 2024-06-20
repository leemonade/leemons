const { schema } = require('./schemas/response/searchOngoingActivitiesRest');
const {
  schema: xRequest,
} = require('./schemas/request/searchOngoingActivitiesRest');

const openapi = {
  summary: 'Search ongoing activities for the user',
  description: `This endpoint facilitates the retrieval of ongoing activities related to the user. It is designed to provide a list of activities currently active or in progress, which the user has been assigned or has roles assigned in, illustrating typical use in educational or training platforms.

**Authentication:** Users are required to be authenticated to access ongoing activities. This ensures that activities are appropriately secured and that users can only access activities that are relevant to their roles and assignments.

**Permissions:** This endpoint demands specific permissions allowing the user to view ongoing activities. The exact permissions may include viewing capabilities based on the user's role or group within the application, ensuring they only access assigned or permitted activities.

The process begins with the 'searchEvaluatedActivities' method, which filters the activities based on evaluation criteria specific to each user's role or assignments. Following the filtering process, the 'getInstancesData', 'getAssignablesData', 'getAssetsData', and 'getStudentAssignations' methods from the 'activitiesData' directory are sequentially invoked to compile detailed information about each activity. This compiled data includes everything from basic activity details to specific user assignments and related resources, which are then returned to the user in a structured JSON format. The flow ensures that all accessed data passes through stringent checks for permissions and user authentication.`,
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
