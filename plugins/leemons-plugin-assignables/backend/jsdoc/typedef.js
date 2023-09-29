/**
 * @typedef AssignablesAssignable
 * @property {string} id - Unique identifier of the assignable
 * @property {string} deploymentID - Deployment identifier
 * @property {string} asset - Asset of the assignable
 * @property {string} role - Role of the assignable
 * @property {boolean} gradable - If the assignable is gradable
 * @property {string} center - Center of the assignable
 * @property {string} statement - Statement of the assignable
 * @property {string} development - Development of the assignable
 * @property {string} duration - Duration of the assignable
 * @property {Object} resources - Resources of the assignable
 * @property {Object} submission - Submission of the assignable
 * @property {string} instructionsForTeachers - Instructions for teachers
 * @property {string} instructionsForStudents - Instructions for students
 * @property {Object} metadata - Metadata of the assignable
 */

/**
 * @typedef AssignablesInstance
 * @property {string} assignable - Assignable of the instance
 * @property {boolean} alwaysAvailable - If the instance is always available
 * @property {string} duration - Duration of the instance
 * @property {boolean} gradable - If the instance is gradable
 * @property {boolean} requiresScoring - If the instance requires scoring
 * @property {boolean} allowFeedback - If the instance allows feedback
 * @property {boolean} showResults - If the instance shows results
 * @property {boolean} showCorrectAnswers - If the instance shows correct answers
 * @property {boolean} sendMail - If the instance sends mail
 * @property {string} messageToAssignees - Message to assignees
 * @property {Object} curriculum - Curriculum of the instance
 * @property {Object} metadata - Metadata of the instance
 * @property {Object} relatedAssignableInstances - Related assignable instances
 * @property {string} event - Event of the instance
 * @property {boolean} addNewClassStudents - If the instance adds new class students
 */

/**
 * @typedef AssignablesAssignation
 * @property {string} instance - Instance of the assignation
 * @property {boolean} indexable - If the assignation is indexable
 * @property {string} user - User of the assignation
 * @property {Object} classes - Classes of the assignation
 * @property {Object} metadata - Metadata of the assignation
 * @property {boolean} emailSended - If the email has been sent for the assignation
 * @property {boolean} rememberEmailSended - If the remember email has been sent for the assignation
 */
