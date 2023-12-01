const { schema } = require('./schemas/response/countRest');
const { schema: xRequest } = require('./schemas/request/countRest');

const openapi = {
  summary: 'Counts the number of timetable entries matching filters',
  description: `This endpoint calculates the total number of timetable entries that match certain filter criteria. The count helps in understanding the volume of timetable data and can assist in front-end pagination or reporting features.

**Authentication:** Users need to be authenticated in order to count the timetable entries. The endpoint checks for valid credentials before proceeding with the request.

**Permissions:** The user must have permissions to view the timetable data they are trying to count. This typically requires the user to have specific roles or privileges within the application addressing data visibility and access control.

Upon receiving a request, the handler \`countRest\` initiates a process involving a call to the \`count\` method found in the \`timetables/count.js\` core file. This method constructs a query using helpers like \`timeFiltersQuery.js\` to apply any necessary time-related filters to the database query. The query is executed against the data store that holds the timetable entries. The resultant count of records that match the filters is then sent back as the response. The entire flow encompasses validating authentication and permissions, constructing the query, executing it against the database, and handling the response with the count data.`,
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
