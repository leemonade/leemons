const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all regional configurations available',
  description: `This endpoint fetches the list of all regional configurations applicable across different geographic or institutional setups. It is primarily used to gather all configurations that can be applied to academic calendars based on regional differences.

**Authentication:** Users must be authenticated to retrieve regional configuration data. An absence of a valid authentication mechanism will prevent access to this endpoint.

**Permissions:** This endpoint requires that the user have administrative rights or specific permissions related to managing or viewing academic configurations, ensuring that only authorized personnel handle sensitive regional setup data.

Upon being called, this handler initiates a process by calling the \`listRegionalConfigs\` function from the academic calendar plugin's backend core. The process includes querying the database for entries that define various regional settings within the scope of academic activities. Each entry typically covers details such as dates, holidays, and other regional-specific information pertinent to the academic calendar. The resulting data is then formatted appropriately and returned as a JSON array, providing a comprehensive overview of all regional configurations stored in the system. Each configuration detailed helps in tailoring the academic system to better fit local needs and regulations.`,
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
