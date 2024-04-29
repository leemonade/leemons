const { schema } = require('./schemas/response/getScheduleRest');
const { schema: xRequest } = require('./schemas/request/getScheduleRest');

const openapi = {
  summary: "Fetches a user's schedule for display on the frontend",
  description: `This endpoint extracts and formats a specific user’s schedule to be suitably displayed on a frontend application. The schedule encompasses all calendar entries, including personal events and system-wide notifications that are applicable to the user.

**Authentication:** Users must be authenticated to retrieve their schedule. Failure to provide valid authentication credentials will prevent access to this endpoint.

**Permissions:** The user needs to have the 'view_schedule' permission to fetch their personal schedule data. Without this permission, the endpoint will restrict access and return an unauthorized error.

The endpoint begins by invoking the \`getScheduleToFrontend\` function from the \`calendar\` module in \`leemons-plugin-calendar\`'s backend. This function takes user identification (extracted from the authentication context) and consults the backend's calendar database to gather all relevant schedule entries. It processes this data to ensure that it conforms to the requirements for user-friendly display, including formatting of date and time according to user locale settings. Finally, the method returns the processed schedule data as a JSON object, which is then sent back to the client as the HTTP response.`,
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
