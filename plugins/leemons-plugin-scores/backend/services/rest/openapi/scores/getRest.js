const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: "Compute and return user's score records",
  description: `This endpoint is responsible for computing and returning the score records pertaining to a user. It collates the scoring data across various metrics and formats them for consumption by clients, such as reporting tools or user dashboards.

**Authentication:** Users need to be authenticated to request their score records. Requests lacking proper authentication will be rejected.

**Permissions:** Users must have the 'view_scores' permission to retrieve score data. Access to scores could be further restricted based on the role or group membership within the educational institution.

Upon receiving a request, the 'getScores' action is triggered which initiates a sequence of operations to process the user's scoring data. It begins by validating the user's session and permissions through authentication middleware. Once authorized, it interacts with the 'getScores' method from the 'scores' core module. This method orchestrates the data retrieval, calculations, and formatting necessary to represent the user's scores accurately. The retrieved data undergoes processing to align with the expected output structure and then is returned to the requester in a structured JSON format, encapsulating various score components relevant to the user.`,
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
