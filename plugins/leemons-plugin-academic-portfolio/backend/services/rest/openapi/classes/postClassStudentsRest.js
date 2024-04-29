const { schema } = require('./schemas/response/postClassStudentsRest');
const { schema: xRequest } = require('./schemas/request/postClassStudentsRest');

const openapi = {
  summary: 'Registers multiple students to a class',
  description: `This endpoint is responsible for adding a list of students to a specific class within the academic portfolio system. It typically receives a list of student identifiers and a class identifier, then processes these inputs to add each student to the class in the system database.

**Authentication:** User authentication is required to access this endpoint. Only authenticated users with valid session tokens can initiate the process of adding students to a class.

**Permissions:** Specific permissions such as 'manage_class_students' or 'class_edit' might be required to perform this operation. Users without appropriate permissions will be denied access to this functionality.

The process begins with the validation of input data to ensure that all necessary parameters like student IDs and the class ID are provided and valid. Subsequent calls are made to the \`addClassStudents\` method in the backend logic, which interacts with the database to register each student into the designated class. The method checks for existing records to avoid duplicates and handles possible exceptions or errors during the process. Successfully added students are then confirmed, and the endpoint returns a success response, indicating that the students have been successfully added to the class.`,
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
