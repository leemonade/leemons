const { schema } = require('./schemas/response/detailProgramRest');
const { schema: xRequest } = require('./schemas/request/detailProgramRest');

const openapi = {
  summary: 'Detail information of a specific academic program',
  description: `This endpoint retrieves comprehensive details about a specific academic program, such as its structure, offered courses, associated groups, and relevant knowledge areas. It's designed to provide students and faculty with a clear understanding of a program's components and organization.

**Authentication:** User authentication is mandatory to access the academic program details. Users without valid authentication credentials will be denied access to this information.

**Permissions:** Appropriate permissions are required to view detailed academic program information. Users must have the role or access rights needed to fetch educational program data.

Upon receiving a request, the \`detailProgramRest\` handler first verifies the user's authentication status and checks whether the user has sufficient permissions to access the program information. Assuming authentication and permissions are validated, it proceeds to gather detailed program data. The handler interacts with various services and methods, such as \`getProgramSubstages\`, \`getProgramCourses\`, \`getProgramGroups\`, \`getProgramKnowledges\`, \`getProgramSubjects\`, \`getProgramSubjectTypes\`, \`getProgramCycles\`, and \`getProgramTreeTypes\` to compile a complete picture of the program. These methods provide granular data about the program's structure, offerings, and classification. The result is then structured into a coherent response object that includes all pertinent program details and sent back to the requester in the form of a JSON object.`,
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
