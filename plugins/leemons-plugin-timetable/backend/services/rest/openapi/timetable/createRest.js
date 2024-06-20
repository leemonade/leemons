const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Create a new timetable entry',
  description: `This endpoint is responsible for creating a new timetable entry in the leemons plugin system, including all necessary scheduling details from the provided data.

**Authentication:** User authentication is required to ensure only authorized users can create new timetable entries. An unauthorized access attempt will result in denial of the service.

**Permissions:** The user must have 'timetable.create' permissions to be able to add new timetable entries. Lack of proper permissions will prevent the user from executing this action.

The endpoint initiates the process by calling the \`create\` method in the timetable core module. This involves several steps: firstly, validating the input data against predefined schemas to ensure all required fields are present and correctly formatted. Next, it utilizes the \`timeToDayjs\` helper to convert time data into a suitable format for processing. Assuming validation passes, the \`create\` method proceeds to insert the new entry into the database with all the relevant details provided in the request. After successful insertion, a response is generated and returned to the user indicating the successful creation of the timetable entry.`,
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
