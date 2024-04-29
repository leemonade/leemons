const { schema } = require('./schemas/response/getIfKnowHowToUseRest');
const { schema: xRequest } = require('./schemas/request/getIfKnowHowToUseRest');

const openapi = {
  summary: "Validate user's understanding of REST fundamental concepts",
  description: `This endpoint assesses whether the user has adequate knowledge of RESTful concepts and principles. It serves as a preliminary check to advance users to more complex interactions within the application.

**Authentication:** Users need to authenticate before attempting this validation. Unauthenticated requests are automatically rejected.

**Permissions:** This endpoint requires the user to have basic user access. Specific roles or privileges are not required beyond standard user access rights.

Upon invocation, this handler initializes by checking the user's session state to validate successful authentication. It then retrieves the user's profile data to ascertain their role and current status within the application. The process involves verifying if the user has previously passed any basic REST knowledge checks. This is conducted via a query to the user database or a relevant cache. Subsequent to this validation, the endpoint responds with a success or failure message delineating the user's competency in REST principles. If successful, the user may be redirected or granted access to make more complex RESTful requests within the system.`,
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
