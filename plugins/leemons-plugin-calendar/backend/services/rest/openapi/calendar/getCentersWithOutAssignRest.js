const { schema } = require('./schemas/response/getCentersWithOutAssignRest');
const {
  schema: xRequest,
} = require('./schemas/request/getCentersWithOutAssignRest');

const openapi = {
  summary: 'Fetch centers without assigned calendars',
  description: `This endpoint fetches all educational or organizational centers that currently do not have any calendar configurations assigned to them. The result helps administrators to identify which entities need attention for calendar setup.

**Authentication:** Users need to be authenticated to ensure secure access to this information. Authentication is verified by checking the provided user token against active sessions or user databases.

**Permissions:** This endpoint requires administrative permissions as it deals with broad organizational data that involves multiple centers. Users must have the 'manage_calendars' or equivalent rights to invoke this endpoint.

After authentication and permission checks are validated, the endpoint proceeds by invoking the \`getCentersWithOutAssign\` method of the \`CalendarConfigs\` core service. This method performs a database query to list all centers that lack associated calendar configurations. The process involves filtering data based on specific attributes and associations in the organizational model. The outcome is then formatted and returned in a structured JSON response, listing the centers in question.`,
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
