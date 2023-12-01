const { schema } = require('./schemas/response/searchRest');
const { schema: xRequest } = require('./schemas/request/searchRest');

const openapi = {
  summary:
    'Searches for assignable instances based on user profile and filters',
  description: `This endpoint searches for assignable instances that correspond to the current user profile and specified filters, such as date ranges, class associations, and roles. It is designed to provide a tailored view of relevant assignables, facilitating the process of managing and participating in educational or training activities.

**Authentication:** Users need to be authenticated to initiate a search for assignable instances. Without proper authentication, the request will be rejected, and the endpoint will not provide the search functionality.

**Permissions:** Specific permissions are necessary to ensure that a user can only search for assignables they are authorized to view or manage. The endpoint will enforce these permissions to maintain security and data integrity within the system.

Upon receiving a request, \`searchInstances\` begins by invoking methods designed to narrow down the instance results based on the provided filters. It starts with \`getActivitiesByProfile\`, which identifies activities related to the user's profile. It then uses filters like \`filterByInstanceDates\`, \`filterByClasses\`, \`filterByRole\`, and \`searchByAsset\` to refine the search results further. Functions like \`getAssignables\` gather data about the eligible instances, while others such as \`filterByGraded\` remove instances based on grading completion. The flow includes retrieving date-related information through \`getInstanceDates\` and \`getAssignationsDates\` to provide temporal context for the instances. Aggregation methods like \`getInstancesSubjects\` and \`getInstanceGroup\` compile subject and group-related data, and \`sortByDates\` organizes the final output. Throughout the flow, the handler meticulously processes information to ensure the response includes instances that adhere strictly to the user's permissions and search criteria. The final payload is a carefully constructed list of assignable instances tailor-made for the requesting user's profile.`,
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
