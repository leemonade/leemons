const { schema } = require('./schemas/response/setQuestionResponseRest');
const {
  schema: xRequest,
} = require('./schemas/request/setQuestionResponseRest');

const openapi = {
  summary: 'Record user response to a feedback question',
  description: `This endpoint allows a user to submit their response to a specific feedback question in a survey or form within the platform. The information collected helps in gathering user feedback for various aspects of service or product improvement.

**Authentication:** User authentication is required to ensure that responses are recorded from verified users and to maintain the integrity of the feedback gathered.

**Permissions:** Users must have the necessary permissions to submit feedback. These permissions ensure that only eligible users can respond to the feedback questions and prevent unauthorized submissions.

Upon receiving a request, the \`setQuestionResponseRest\` property's handler starts by validating the presence and validity of the payload, which includes the user's response and question identifiers. If the input is valid, it calls on the \`setQuestionResponse\` method from the \`feedback-responses\` core. This method processes the input, saves the user's response to the appropriate question in the database, and ensures that the data is properly recorded and associated with the user's session. The flow involves error handling to catch potential issues such as database errors or invalid responses. Once the user's response is successfully recorded, the handler sends back an acknowledgment message along with relevant details or identifiers of the saved response.`,
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
