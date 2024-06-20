const { schema } = require('./schemas/response/putClassRest');
const { schema: xRequest } = require('./schemas/request/putClassRest');

const openapi = {
  // summary: "Summary",
  description: `{
  "summary": "Update class details in the academic portfolio",
  "description": "This endpoint allows for the updating of specific class details within the academic portfolio subsystem of the Leemonade platform. It is utilized primarily to modify class attributes such as name, schedule, and associated teacher or course data.

**Authentication:** Users must be authenticated prior to accessing this endpoint. A valid session or authentication token is mandatory, and any unauthorized access attempt will result in an error response, ensuring security compliance.

**Permissions:** Appropriate permissions are required to access this endpoint. Typically, the user must have administrative rights or specific academic staff privileges to modify class data. Permission checks are performed to ensure that only authorized users can perform updates.

The process begins with the validation of the input data to ensure that it conforms to expected formats and values. Next, the \`updateClass\` method in the \`class.rest.js\` service is invoked, which interplays with various backend logic such as \`existCourseInProgram\`, \`existGroupInProgram\`, and \`isUsedInSubject\` to validate the current state before applying any updates. If validation passes, the class details are updated in the database using transactional operations to ensure data integrity. A response is then generated and sent back, indicating the successful update or detailing any errors encountered during the process."
}`,
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
