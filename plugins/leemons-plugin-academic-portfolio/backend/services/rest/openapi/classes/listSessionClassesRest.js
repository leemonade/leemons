const { schema } = require('./schemas/response/listSessionClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSessionClassesRest');

const openapi = {
  summary: 'List session classes linked to the user',
  description: `This endpoint provides a collection of class sessions that are associated with the currently authenticated user. It filters and aligns sessions with the user's academic profile and ongoing programs.

**Authentication:** Users must be logged in to retrieve their class sessions. Authentication is necessary to ensure that each user only accesses classes relevant to their academic endeavors.

**Permissions:** Appropriate permissions are required for the user to retrieve information about classes. Users can only view classes for which they have been granted access rights, typically based on their role or enrollment status within the academic program.

Upon receiving the request, the \`listSessionClassesRest\` handler begins by validating the user's authentication status and permissions. Once validated, it calls the \`listSessionClasses\` method from the backend core class's logic. This method processes the request by querying the database for class sessions that match the user's profile, taking into account factors such as the user's enrolled courses, current academic term, and program role. The result is then formatted appropriately and returned as a JSON payload, which contains the relevant class session details tailored to the authenticated user's academic context.`,
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
