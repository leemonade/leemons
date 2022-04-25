const _ = require('lodash');
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { registerDates, getDates } = require('../dates');
const { assignations } = require('../tables');
const registerGrade = require('../grades/registerGrade');
const getGrade = require('../grades/getGrade');
const addPermissionToUser = require('../assignableInstance/permissions/assignableInstance/users/addPermissionToUser');

module.exports = async function getAssignation(
  assignableInstanceId,
  user,
  { userSession, transacting } = {}
) {
  let assignation = await assignations.findOne(
    {
      instance: assignableInstanceId,
      user,
    },
    { transacting }
  );

  if (!assignation) {
    throw new Error('Assignation not found or not allowed');
  }

  assignation = {
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  };

  assignation.timestamps = await getDates('assignation', assignation.id, { transacting });
  assignation.grades = await getGrade({ assignation: assignation.id }, { transacting });

  return assignation;
};
