const { schema } = require('./schemas/response/listSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/listSubjectTypeRest');

const openapi = {
  summary: 'List all subject types available',
  description: `This endpoint lists all subject types defined within the academic portfolio system. It retrieves a collection of subject types that can be used for categorizing subjects or courses in an educational institution.

**Authentication:** Users need to be authenticated to request the list of subject types. Access to this endpoint requires a valid session or authentication token.

**Permissions:** The user must have permissions to view academic structures or details, such as being a part of the academic staff or administrative personnel with the right to access academic configurations.

Upon receiving a request, the \`listSubjectTypeRest\` action calls the \`listSubjectType\` method from the \`subject-type\` core. The \`listSubjectType\` method is responsible for querying the database and returning an array of available subject types. This array includes crucial details for each subject type, such as name, code, and any other metadata associated with the subject type entity. The endpoint then formats this array into a JSON response and sends it back to the client, thereby providing a comprehensive list of subject types for educational categorization and planning.`,
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
