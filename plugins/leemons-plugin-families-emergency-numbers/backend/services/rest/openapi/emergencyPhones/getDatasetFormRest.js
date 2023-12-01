const { schema } = require('./schemas/response/getDatasetFormRest');
const { schema: xRequest } = require('./schemas/request/getDatasetFormRest');

const openapi = {
  summary: "Fetch emergency contact numbers based on user's family details",
  description: `This endpoint provides a list of emergency contact numbers relevant to the user's family members. It aggregates data based on the family configuration and members' locations to deliver a personalized set of emergency contacts.

**Authentication:** Access to this endpoint requires the user to be authenticated. Failure to provide valid credentials will result in access being denied.

**Permissions:** Users need to have the 'view_emergency_numbers' permission, which allows them to retrieve emergency contact numbers associated with their family members.

Upon receiving a request, the controller validates the user's authentication status. If authenticated, it checks whether the user has the necessary permissions to view emergency numbers. Granted access, the controller proceeds to call the internal 'getEmergencyNumbers' service, which collates emergency contact details based on the family members' recorded locations and any additional relevant data. The gathered information then passes through a transformation phase if necessary, to adhere to the response format. Finally, the controller sends back the curated list of emergency phone numbers in JSON format as a response to the client.`,
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
