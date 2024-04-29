const { schema } = require('./schemas/response/generateRest');
const { schema: xRequest } = require('./schemas/request/generateRest');

const openapi = {
  summary: 'Generate detailed report for Fundae requirements',
  description: `This endpoint is responsible for generating a comprehensive report based on Fundae training activities, ensuring that the dataset conforms to specific regulatory and operational standards set by Fundae. The generated reports aim to assist in administrative, compliance, and educational analysis.

**Authentication:** Users must be authenticated and hold valid session credentials to initiate report generation. The API requires authentication tokens that validate user identity and session legitimacy.

**Permissions:** The endpoint demands high-level permissions, specifically administrative or managerial access. Users without sufficient permissions cannot trigger the generation process or access the resulting data.

Upon request, the \`generateReport\` handler in \`report.rest.js\` initiates the generation process. It calls upon the \`ReportService\` from the core, which in turn utilizes \`generate.js\` to execute the data compilation and report structuring. The process involves querying multiple databases and aggregating data relevant to Fundae standards, followed by applying business logic to format and finalize the report. This is meticulously designed to ensure accuracy and compliance with Fundae's requirements. The response is a detailed JSON object representing the outcomes of the report generation, usually in a format suitable for immediate application use or further administrative processing.`,
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
