const {
  schema,
} = require('./schemas/response/getDataForUserAgentDatasetsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getDataForUserAgentDatasetsRest');

const openapi = {
  summary: 'Collates user agent data for analytics',
  description: `This endpoint processes and aggregates data related to user agents to support analytics and dataset preparation for reporting purposes. The endpoint targets the extraction of insights that pertain to user behaviors, browser types, operating system usage, and device categories that interact with the system.

**Authentication:** Users are required to be authenticated to initiate data aggregation for user agents. Unauthenticated requests will result in a denial of access to this endpoint.

**Permissions:** The endpoint necessitates specific permissions which permit the invocation of user agent data aggregation. Only authorized users with rights to access and analyze user-related metrics can use this endpoint.

Upon receiving a request, the handler, identified as \`getDataForUserAgentDatasetsRest\`, interacts with the core module \`user-agents\`. It starts by calling \`getDataForUserAgentDatasets\`, which is responsible for fetching and organizing user agent data from the database. The method may apply various transformation and aggregation techniques to produce a comprehensive dataset. This dataset is intended for use in analytics tools or reporting modules that help in understanding user demographics and system usage patterns. The endpoint ensures that all the collected data adheres to privacy standards and is appropriately anonymized before being made available. The response is a well-structured JSON object that encapsulates the user agent analytics data.`,
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
