const { schema } = require('./schemas/response/removeGradeRest');
const { schema: xRequest } = require('./schemas/request/removeGradeRest');

const openapi = {
  summary: 'Remove a specific grade from the system',
  description: `This endpoint is responsible for deleting a grade identified by a unique identifier from the system. The grade removal process includes not only the deletion of the grade record itself but also any associated rules, tags, and grade scales linked to the grade to maintain data integrity across the platform.

**Authentication:** This action requires the user to be logged in with a valid session or token. Without proper authentication, the endpoint will reject the request.

**Permissions:** Users must have the 'grades.remove' permission to execute this action. Attempting to remove a grade without the necessary permissions will result in an access denial.

Upon invocation, the \`removeGradeRest\` handler calls the \`removeGrade\` function from the grades core which is designed to handle the deletion. This function first deletes the grade entry from the database and then proceeds to call \`removeGradeTagsByGrade\` to get rid of any associated tags, followed by \`removeGradeScaleByGrade\` to erase linked grade scales. Finally, it invokes \`rulesInGrade\` to clean up any rules within the grade. The result of these operations is a consolidated handling of the grade deletion process that ensures the removal of all dependent records in a single transactional flow, culminating in a success or error response to the initial HTTP request.`,
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
