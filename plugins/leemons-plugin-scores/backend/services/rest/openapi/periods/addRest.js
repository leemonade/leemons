const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new academic period',
  description: `This endpoint adds a new academic period to the system database. The new period information includes details such as its start and end dates, name, and unique identifier, strategically adding to the academic structure management.

**Authentication:** User must be authenticated to add a new period. Failure to provide valid credentials will prevent access to this endpoint.

**Permissions:** The user needs \`manage_periods\` permission to execute this action, ensuring only authorized personnel can modify academic periods.

The process begins with the endpoint calling the \`addPeriod\` method from the \`periods\` core service. This method first validates the incoming data using the \`validatePeriod\` function to check for correctness and completeness of the period data. After validation, it proceeds to insert the new period data into the database. Upon successful addition, the method returns a success response indicating that the period has been successfully added. This flow ensures the integrity and reliability of the academic period management.`,
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
