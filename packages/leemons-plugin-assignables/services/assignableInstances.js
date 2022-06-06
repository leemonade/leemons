const createAssignableInstance = require('../src/services/assignableInstance/createAssignableInstance');
const getAssignableInstance = require('../src/services/assignableInstance/getAssignableInstance');
const removeAssignableInstance = require('../src/services/assignableInstance/removeAssignableInstance');
const searchAssignableInstances = require('../src/services/assignableInstance/searchAssignableInstances');
const updateAssignableInstance = require('../src/services/assignableInstance/updateAssignableInstance');
const getUserPermission = require('../src/services/assignableInstance/permissions/assignableInstance/users/getUserPermission');
const adminDashboard = require('../src/services/assignableInstance/adminDashboard');

module.exports = {
  getUserPermission,
  createAssignableInstance,
  getAssignableInstance,
  removeAssignableInstance,
  updateAssignableInstance,
  searchAssignableInstances,
  adminDashboard,
};
