const { schema } = require('./schemas/response/getEventTypesRest');
const { schema: xRequest } = require('./schemas/request/getEventTypesRest');

const openapi = {
  summary: 'List all available event types',
  description: `This endpoint provides a listing of all event types that have been defined within the calendar plugin. These event types can be used to categorize various events managed by the system.

**Authentication:** Users must be logged in to retrieve the list of event types. Unauthenticated requests will be rejected.

**Permissions:** The user must have appropriate permissions to access the list of event types. Without the necessary permissions, the request will not provide the event types data.

Upon receiving a request, the handler calls the \`listEventTypes\` method from the \`event-types\` core module. This method is designed to fetch all event types from the system's data store. It may perform filtering based on the request context, such as the user's role or permissions. Each event type is likely represented by an object containing relevant fields, such as the event type's unique identifier, name, and possibly other metadata. The handler then formats the retrieved data into an appropriate response object and returns it to the client, typically as a JSON array of event types.`,
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
