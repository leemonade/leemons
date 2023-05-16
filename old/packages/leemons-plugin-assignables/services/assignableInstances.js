const createAssignableInstance = require('../src/services/assignableInstance/createAssignableInstance');
const getAssignableInstance = require('../src/services/assignableInstance/getAssignableInstance');
const removeAssignableInstance = require('../src/services/assignableInstance/removeAssignableInstance');
const searchAssignableInstances = require('../src/services/assignableInstance/searchAssignableInstances');
const updateAssignableInstance = require('../src/services/assignableInstance/updateAssignableInstance');
const getUserPermission = require('../src/services/assignableInstance/permissions/assignableInstance/users/getUserPermission');
const adminDashboard = require('../src/services/assignableInstance/adminDashboard');
const sendReminder = require('../src/services/assignableInstance/sendReminder');
const getAssignableInstancesStatus = require('../src/services/assignableInstance/getAssignableInstancesStatus');
const getUserPermissions = require('../src/services/assignableInstance/permissions/assignableInstance/users/getUserPermissions');
const getAssignableInstances = require('../src/services/assignableInstance/getAssignableInstances');

module.exports = {
  getUserPermission,
  getUserPermissions,
  createAssignableInstance,
  getAssignableInstance,
  getAssignableInstances,
  removeAssignableInstance,
  updateAssignableInstance,
  searchAssignableInstances,
  adminDashboard,
  sendReminder,
  getAssignableInstancesStatus,
};
