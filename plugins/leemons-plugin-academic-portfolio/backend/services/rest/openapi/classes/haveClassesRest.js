const { schema } = require('./schemas/response/haveClassesRest');
const { schema: xRequest } = require('./schemas/request/haveClassesRest');

const openapi = {
  summary: 'Checks the existence of classes within the academic system',
  description: `This endpoint checks if there are any classes currently existing or active within the academic portfolio of the leemons platform. This function helps in understanding whether the system is populated with academic classes.

**Authentication:** Users need to be authenticated to query for class existence. An unauthenticated request will not be processed.

**Permissions:** Querying the class existence requires academic-admin rights or a similarly privileged role that can access academic data.

The endpoint calls the \`haveClasses\` method from the \`HaveClasses\` core. This method performs a database query to check for the presence of any classes within the system's database. The query checks against multiple parameters to ascertain the activeness and existence of classes. Upon execution, it yields a boolean result indicating the presence (true) or absence (false) of classes in the academic portfolio. This result is then passed back through the API to the requester in the form of a simple JSON response indicating success or failure of the operation.`,
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
