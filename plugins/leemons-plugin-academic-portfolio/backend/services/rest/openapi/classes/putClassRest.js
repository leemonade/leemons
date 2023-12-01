const { schema } = require('./schemas/response/putClassRest');
const { schema: xRequest } = require('./schemas/request/putClassRest');

const openapi = {
  summary: 'Update the details of a specific class',
  description: `This endpoint is responsible for updating the information of a given class in the academic portfolio. The process involves modifying fields such as class name, associated courses, and teachers, as well as any other relevant details that pertain to the class structure in the portfolio.

**Authentication:** This operation requires the user to be authenticated. Access will be denied if authentication credentials are not provided or are invalid.

**Permissions:** The user must have appropriate permissions to modify class information. This typically includes roles such as academic administrators or personnel with specific rights to edit class details within the portfolio.

Upon receiving a request, the \`updateClass\` service action is initiated with payload data containing the modifications for the class. The handler validates the input against predefined schemas to ensure that only correct and allowable changes are processed. If the validation is successful, it proceeds to update the class record in the database layer, applying the changes submitted. Error handling is employed throughout to catch and respond to any issues that may arise during the process, such as invalid input or lack of permissions. Once the update is completed, the response is sent back to the requester with confirmation of the updated class details or with error messages if the update could not be performed.`,
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
