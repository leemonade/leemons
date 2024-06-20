const { schema } = require('./schemas/response/countRest');
const { schema: xRequest } = require('./schemas/request/countRest');

const openapi = {
  summary: 'Counts the number of timetables based on provided filters',
  description: `This endpoint provides the count of timetables that match certain criteria specified through filters. It essentially serves to inform the client about the quantity of timetables, facilitating operations like pagination in the user interface.

**Authentication:** User authentication is mandatory for accessing this endpoint. Without a valid user session, the request will be rejected.

**Permissions:** This endpoint requires the user to have \`view_timetable\` permission to proceed with fetching the count of timetables. Users without sufficient permissions will receive an access denial response.

Upon receiving a request, the endpoint triggers the \`countTimetables\` action from the \`TimetableService\`. This action utilizes the \`timeFiltersQuery\` function from the helpers to generate a query based on the input parameters, which are assumed to include date ranges and possibly other constraints pertaining to timetables. The query is then executed in the database through the \`count.js\` method in the core module, which efficiently counts the entries matching the criteria without retrieving the full data sets. The result, a numerical value indicating the count of timetables, is then returned to the client in a straightforward JSON format.`,
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
