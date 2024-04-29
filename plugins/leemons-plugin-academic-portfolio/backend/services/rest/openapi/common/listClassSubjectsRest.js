const { schema } = require('./schemas/response/listClassSubjectsRest');
const { schema: xRequest } = require('./schemas/request/listClassSubjectsRest');

const openapi = {
  summary: 'Lists class subjects associated with specific classes',
  description: `This endpoint retrieves a list of subjects associated with specified classes. It is primarily utilized for generating detailed views of academic schedules or portfolios within the educational institution's management system.

**Authentication:** User authentication is required for accessing this endpoint. Access is denied if the user is not authenticated or the session has expired.

**Permissions:** Users need to have the 'view_classes' permission. Without this permission, users will not be able to retrieve information on class subjects, enforcing data access restrictions based on user roles within the institution.

This handler invokes the \`listClassesSubjects\` function from the \`common\` core module. The process starts by extracting class identifiers from the request parameters. These identifiers are then used to query the database through the \`listClassesSubjects\`, which retrieves all subjects related to the classes. The queried data includes subject names, codes, and associated teacher details. After the data is collected, it's formatted into a structured response that includes all necessary details about each subject related to the classes in question. This result is then returned to the client as a JSON array.`,
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
