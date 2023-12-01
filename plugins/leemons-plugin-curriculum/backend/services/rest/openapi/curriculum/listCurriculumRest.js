const { schema } = require('./schemas/response/listCurriculumRest');
const { schema: xRequest } = require('./schemas/request/listCurriculumRest');

const openapi = {
  summary: 'List all available curriculums',
  description: `This endpoint lists all curriculums available in the system. It provides a comprehensive view of the curriculum data including titles, course structures, and other relevant metadata organized for easy access and management.

**Authentication:** Users must be authenticated to retrieve the list of curriculums. Unauthorized access will be rejected, ensuring that data privacy is maintained.

**Permissions:** Access to this endpoint is governed by curriculum-management privileges. Only users with the appropriate permissions can obtain the list of curriculums, which ensures operational security and proper access control within the system.

The controller initiates the flow by invoking the \`listCurriculums\` method from the \`curriculum\` core. This method conducts a search in the curriculum database to gather all entries. It filters and organizes the data according to predefined criteria and business logic, ensuring that the response adheres to the functional requirements. Once fetched, the data is shaped into a structured format and returned as a response in JSON format, outlining all curriculums in a list that clients can easily parse and utilize.`,
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
