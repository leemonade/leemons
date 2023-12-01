const { schema } = require('./schemas/response/getStudentsByTagsRest');
const { schema: xRequest } = require('./schemas/request/getStudentsByTagsRest');

const openapi = {
  summary: 'Filters and retrieves student profiles by specified tags',
  description: `This endpoint allows for the retrieval of student profiles based on a collection of tags associated with each student. The filtering process narrows down the list of all students to those who match the specified tag criteria.

**Authentication:** Users need to be authenticated to access this endpoint. Authentication is mandatory to ensure proper authorization and access control.

**Permissions:** Users must have the 'view_students' permission to filter and access the student profiles associated with the provided tags. Without the appropriate permissions, access to this endpoint will be denied.

The controller starts by executing the \`getStudentsByTags\` method found in the \`common\` core module. This method is responsible for querying the underlying data store to fetch a list of student profiles that are tagged with the specified identifiers. It compiles the filtered data and readies it for the response. The endpoint then returns a structured JSON object representing the student profiles that match the filter conditions, allowing the client to utilize this information in accordance with their permissions.`,
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
