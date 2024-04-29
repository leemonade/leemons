const { schema } = require('./schemas/response/listSubjectRest');
const { schema: xRequest } = require('./schemas/request/listSubjectRest');

const openapi = {
  summary: 'List all subjects related to a specific academic portfolio',
  description: `This endpoint lists all subjects associated with a specific academic portfolio based on provided criteria such as program and term. It primarily serves educational staff and students by providing an overview of subjects they might be interested in or are already enrolled in.

**Authentication:** Users need to be authenticated to retrieve subject details. Access to the endpoint is restricted based on user's session validation.

**Permissions:** This endpoint requires that the user has the 'view_subjects' permission within their role. Users without sufficient permissions will be denied access to the subject list.

The process begins when the endpoint 'listSubjects' is invoked from the subject REST service. This calls the 'listSubjects' method in the backend's core subject module, which in turn might interact with a database to retrieve relevant subject information based on the input parameters such as academic program and term identifiers. The method consolidates the data, applying any necessary filters such as checking permissions or roles of the user, before sending back a list of subjects. Each subject is represented as an object within an array, providing a comprehensive overview needed by the frontend for display or further processing.`,
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
