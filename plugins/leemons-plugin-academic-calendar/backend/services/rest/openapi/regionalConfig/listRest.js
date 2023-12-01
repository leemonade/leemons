const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List regional calendar configurations',
  description: `This endpoint lists all regional configurations available for the academic calendar. The information returned can be used to understand the different academic scheduling options and calendar formats that are specific to certain regions.

**Authentication:** Users need to be authenticated in order to fetch the list of regional configurations. Access to this endpoint will be restricted if the user’s credentials are not provided or are invalid.

**Permissions:** Users must have the 'view_academic_calendar' permission to retrieve the list of regional configurations. Without the appropriate permissions, access to this endpoint will be denied.

Upon receiving a request, the controller first verifies the user's authentication and permissions. It then calls the \`listRegionalConfigs\` method from the \`regional-config\` core module. This method is responsible for querying the database to retrieve all the existing regional configurations for academic calendars. The data is then formatted according to the required response structure and sent back to the client in a JSON array. Each object within the array provides details about a specific regional configuration, enabling frontend applications to present these options to users for selection or review.`,
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
