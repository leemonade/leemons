const { schema } = require('./schemas/response/putCycleRest');
const { schema: xRequest } = require('./schemas/request/putCycleRest');

const openapi = {
  summary: 'Update an academic cycle',
  description: `This endpoint updates a specific academic cycle's details within the academic portfolio plugin of the \`leemonade\` platform. The endpoint facilitates the modification of cycle attributes such as start date, end date, and associated programs or courses.

**Authentication:** Users need to be authenticated to update an academic cycle. Access to this functionality might be allowed only through secure and verified login sessions.

**Permissions:** This functionality requires the user to have administrative rights over academic cycle management. Typically, this would include roles like Academic Administrator or System Administrator who has privileges to modify academic entities.

Upon receiving a request, the endpoint first verifies user authentication and permissions. If valid, it then proceeds to invoke the \`updateCycle\` function from the \`Cycle\` core module. This function is responsible for checking the existence of the cycle and applying the updates if valid parameters are provided. Error handling mechanisms are employed to manage cases where the cycle does not exist or invalid data is provided. The response communicates the status of the operation along with any pertinent updated cycle information or error messages.`,
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
