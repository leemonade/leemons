const { schema } = require('./schemas/response/addViewRest');
const { schema: xRequest } = require('./schemas/request/addViewRest');

const openapi = {
  summary: 'Increment view count for a specific message',
  description: `This endpoint increments the view count of a specific message on the board. The operation counts each view from users to provide insights into the popularity and engagement level of the message.

**Authentication:** User authentication is required to track the views adequately and ensure that views are counted accurately for each user. A valid user session is necessary to perform this operation.

**Permissions:** Users need to have 'read' permission for the specific message to increment its view count. Attempting to access the endpoint without appropriate permissions will result in access denial.

Initially, the endpoint validates the user's authentication status and checks if the user has 'read' permission for the message in question. Upon successful validation, it calls the \`addView\` method from the \`Messages\` core, passing the message's unique identifier. This method updates the view count in the database. The flow ensures that each view is logged only once per user session, using session management techniques to prevent duplicate counts. The updated view count data is then committed to the database, ensuring consistency and accuracy throughout the process.`,
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
