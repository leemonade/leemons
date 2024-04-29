const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all academic periods',
  description: `This endpoint lists all academic periods available within the system, allowing users to view various educational time frames such as semesters, quarters, or other academic sessions.

**Authentication:** Users need to be authenticated to retrieve the list of periods. Access to this endpoint is denied if authentication credentials are not provided or are invalid.

**Permissions:** This endpoint requires users to have the 'view_periods' permission. Users without this permission will not be able to access the list of academic periods.

The method responsible for handling the request starts by invoking the \`listPeriods\` function from the \`periods\` core. This function performs a query to the database to retrieve all the periods recorded in the system. Each period includes details such as the start date, end date, and type of the period. The server processes this data and returns it as a structured list in the response body, ensuring that clients can easily interpret and utilize the information on the academic periods.`,
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
