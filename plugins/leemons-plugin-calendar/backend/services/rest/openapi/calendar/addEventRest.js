const { schema } = require('./schemas/response/addEventRest');
const { schema: xRequest } = require('./schemas/request/addEventRest');

const openapi = {
  summary: "Add a new event to the user's calendar",
  description: `This endpoint allows for the creation of a new event within the user's personal or shared calendar. The functionality includes setting the event details such as title, description, time, and participants.

**Authentication:** User authentication is mandatory to guarantee that the event is being created in the context of a valid user session. The process will be aborted if user credentials are not provided or are invalid.

**Permissions:** Adequate permissions are required to add an event to the calendar. The user must have the rights to create events within the specified calendar, and this is validated as part of the request processing.

The \`addEventRest\` handler begins by validating the incoming request data against the defined validation schema to ensure all necessary information is provided and meets the expected format. It then proceeds to call the \`addFromUser\` method from the \`events\` core, passing the validated data and the user context. This method integrates various calendar logic, handling the creation of the event, checking for conflicts, sending notifications to the invitees, and updating the calendar state. On successful addition, the endpoint returns a confirmation with details of the created event. In case of an error, such as insufficient permissions or input validation failure, an appropriate error response is generated and returned to the user.`,
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
