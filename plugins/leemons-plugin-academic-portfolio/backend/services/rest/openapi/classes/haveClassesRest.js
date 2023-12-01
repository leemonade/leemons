const { schema } = require('./schemas/response/haveClassesRest');
const { schema: xRequest } = require('./schemas/request/haveClassesRest');

const openapi = {
  summary: 'Checks the existence of classes for the current academic period',
  description: `This endpoint verifies whether there are existing classes associated with the logged-in user for the current academic period. Based on this verification, the endpoint confirms if the academic portfolio has content to be displayed or managed.

**Authentication:** User access is mandatory for invoking this endpoint. An uninitialized user session or invalid credentials will prevent the use of this service.

**Permissions:** This endpoint requires the user to have the 'view_class' permission, ensuring that only authorized personnel can verify the presence of academic classes.

Upon receiving a request, the 'haveClassesRest' handler initiates a check by communicating with the backend service responsible for the academic portfolio. It calls the 'haveClasses' function from the core class library, passing in any necessary parameters, such as the user's context and academic period information. The 'haveClasses' function runs a database query to detect any classes linked to the user's account for the given period. Based on the results, the function returns a boolean value indicating the existence of classes. This boolean is then sent back to the requester in the response payload, informing them about the availability of academic portfolio content for the current period.`,
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
