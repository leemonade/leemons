const {
  filterAssignationsByDaysUntilDeadline,
} = require('./filterAssignationsByDaysUntilDeadline');
const { filterAssignationsByInstance } = require('./filterAssignationsByInstance');
const { filterAssignationsByProgress } = require('./filterAssignationsByProgress');
const { filterAssignationsByStudentDidOpen } = require('./filterAssignationsByStudentDidOpen');
const { filterInstancesByProgramAndSubjects } = require('./filterInstancesByProgramAndSubjects');
const { filterInstancesByRoleAndQuery } = require('./filterInstancesByRoleAndQuery');
const { filterInstancesByStatusAndArchived } = require('./filterInstancesByStatusAndArchived');

module.exports = {
  filterAssignationsByInstance,
  filterAssignationsByProgress,
  filterAssignationsByStudentDidOpen,
  filterInstancesByProgramAndSubjects,
  filterInstancesByRoleAndQuery,
  filterInstancesByStatusAndArchived,
  filterAssignationsByDaysUntilDeadline,
};
