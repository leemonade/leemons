const { schema } = require('./schemas/response/getZoneRest');
const { schema: xRequest } = require('./schemas/request/getZoneRest');

const openapi = {
  summary: 'Fetch and display widgets from the specified zone',
  description: `This endpoint is responsible for fetching and displaying all widgets that belong to a specific widget zone within the system. It involves retrieving widget configurations based on the zone identifier provided in the request.

**Authentication:** Users need to be logged in to interact with widget zones. The endpoint will verify the presence of a valid session or authentication token before proceeding.

**Permissions:** Access to this endpoint requires specific permissions related to widget management. Users without sufficient privileges will be denied access to widget zone information.

This endpoint initializes by invoking the \`getZone\` action from the widgetZone's core service. The action requires the zone's identifier, which is typically provided as a parameter in the request. Upon receiving a valid request, the server calls the \`get\` method from the \`widgetZone\` core, which queries the underlying database to retrieve all widget configurations associated with the specified zone. It meticulously assembles the data, returning a structured response that includes the widgets' details as well as their respective ordering and display properties. The client then receives this information in a well-formatted JSON response, ideally suited for immediate use within a user interface.`,
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
