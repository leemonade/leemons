const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update academic portfolio settings',
  description: `This endpoint updates the academic portfolio settings based on the provided input values. The operation typically includes changing parameters such as grading schemas, assessment standards, and visibility permissions among other configurable settings of the academic portfolio module.

**Authentication:** User authentication is mandatory for accessing this endpoint. Users attempting to update settings without proper authentication credentials will be denied access.

**Permissions:** Users need to have specific administrative permissions related to academic portfolio management. These permissions ensure that only authorized personnel can make changes to the settings.

The endpoint leverages the \`updateSettings\` method defined in the \`settings\` core module. The flow begins when the request data is received and validated against predefined schemas to ensure all required fields are present and correctly formatted. Upon successful validation, the \`updateSettings\` method is called with the relevant data. This method primarily handles the interaction with the database to update the existing settings record. If the update is successful, a confirmation is sent back to the client. If there is an error during the update, such as a database write failure, the error details are captured and an appropriate response is returned to the client, indicating the failure of the update operation.`,
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
