const { getActivitiesDates } = require('./getActivitiesDates');
const { getAssetsData } = require('./getAssetsData');
const { getAssignablesData } = require('./getAssignablesData');
const { getInstancesData } = require('./getInstancesData');
const {
  getInstanceSubjectsProgramsAndClasses,
} = require('./getInstanceSubjectsProgramsAndClasses');
const { getStudentAssignations } = require('./getStudentAssignations');
const { getTeacherInstances } = require('./getTeacherInstances');

module.exports = {
  getActivitiesDates,
  getAssetsData,
  getAssignablesData,
  getInstancesData,
  getInstanceSubjectsProgramsAndClasses,
  getStudentAssignations,
  getTeacherInstances,
};
