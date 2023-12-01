const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Creates timetable configuration',
  description: `This endpoint is responsible for creating a new timetable configuration within the system, which involves defining the various time slots and breaks applicable to the timetable.

**Authentication:** Users are required to be authenticated to invoke this endpoint. Ensuring that only authorized users can create new timetable configurations sustains the integrity of the timetable system.

**Permissions:** Users must possess the 'timetable:create' permission to execute this action. Without this permission, the endpoint will prohibit any attempt to create a new timetable configuration.

Upon receiving a request, the handler triggers the \`createConfig\` method from the \`ConfigService\`. This method takes care of validating input data and inserting the new configuration into a persistent storage mechanism, typically a database. If the creation is successful, the method returns details of the newly created timetable configuration. The entire process ensures that the new configuration adheres to the predefined rules and formats required for timetable configurations in the system. The response of this endpoint relays confirmation of creation along with the properties of the newly established timetable configuration.`,
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
