const { schema } = require('./schemas/response/listSessionClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSessionClassesRest');

const openapi = {
  summary: 'Lists session classes associated with the user',
  description: `This endpoint lists all the class sessions associated with the currently authenticated user's active academic sessions. It filters classes based on user’s session and role within the academic portfolio, thereby providing a tailored view according to the user’s academic engagement.

**Authentication:** Users need to be authenticated to retrieve their session classes. Unauthenticated requests will not be processed.

**Permissions:** This endpoint requires the user to have the 'view_classes' permission within their academic portfolio. Without sufficient permissions, the user will not be able to access the class list.

The process begins by validating the user's authentication and permissions. Once validation is complete, the endpoint invokes the \`listSessionClasses\` method from the \`ClassesService\`. This service fetches the classes from the database that are linked to the user’s current active sessions, by examining user roles and associations within each class environment. Each class fetched includes details such as class name, subject, and schedule, structured to align with the user’s academic requirements. The resulting data is then formatted into a JSON structure and returned as a HTTP response, providing a comprehensive list of relevant session classes.`,
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
