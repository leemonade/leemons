const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Find a single setting by its specifications',
  description: `This endpoint retrieves specific configuration settings based on several search criteria provided as input. It is designed to pinpoint and return granular details about a particular setting within the system's configuration pool.

**Authentication:** Users need to be authenticated to perform this search. Access to this endpoint will be denied if authentication credentials are not valid or are missing.

**Permissions:** Specific permissions related to settings management are required to access this endpoint. Users without sufficient permissions will not be able to retrieve setting details.

The handler begins by accepting a request that includes identification criteria for the desired setting. These criteria are processed by the \`findOne\` method in the \`settings\` core. This method makes a query to the system's database, attempting to locate a setting that matches the provided criteria. The result of this query is then returned to the user as a JSON object if successful. This process ensures that only the requested, authorized setting information is retrieved and disclosed.`,
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
