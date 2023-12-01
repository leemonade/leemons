const { schema } = require('./schemas/response/postCurriculumRest');
const { schema: xRequest } = require('./schemas/request/postCurriculumRest');

const openapi = {
  summary: 'Add a new curriculum to the system',
  description: `This endpoint allows for the creation of a new curriculum within the platform. It processes the curriculum data submitted and adds it to the relevant database collections.

**Authentication:** Users must be logged in to submit a new curriculum. This ensures that only authorized personnel can modify the curriculum structure.

**Permissions:** The endpoint requires users to have 'curriculum:create' permission to add a new curriculum. Users without this permission will be denied access to this functionality.

Upon receiving the curriculum data from the request, the handler initiates a series of validations to ensure the data meets the platform's structural and content requirements set forth in '\`forms.js\`'. Once validated, it calls upon the '\`addCurriculum.js\`' method from the curriculum core module that handles the logic for inserting the new curriculum into the database. The method's interaction with the database involves creating records that represent the structural elements of the curriculum, including its nodes and levels as governed by the '\`nodeLevels\`' and '\`nodes\`' core modules. The 'addCurriculum' function assembles these various pieces, saving them in a coherent and relational way that reflects the curriculum's hierarchy. Should the addition be successful, the endpoint returns a confirmation with the newly created curriculum's details.`,
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
