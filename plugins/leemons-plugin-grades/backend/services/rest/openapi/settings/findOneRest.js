const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Fetch specific grade plugin settings',
  description: `This endpoint fetches the settings for the leemons-plugin-grades based on certain criteria. It utilizes the \`findOne\` function defined within the grades plugin's settings core logic to retrieve a single settings record that matches the given query.

**Authentication:** Users must be authenticated to fetch grade plugin settings. Any request without proper authentication will be rejected.

**Permissions:** Users need to have appropriate permissions to access grade settings. Without the required permissions, the request will not be processed.

Upon receiving a request, the handler calls the \`findOne\` method implemented in the settings core file 'findOne.js'. This method handles the querying of the database to find the specific settings record. It accepts a query object that details the criteria for selection. The database operation looks for a document in the settings collection that matches these criteria, returning either the found document or a 'not found' error. The outcome of this operation is then wrapped into the HTTP response and sent back to the requester, indicating success or failure in retrieving the desired settings.`,
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
