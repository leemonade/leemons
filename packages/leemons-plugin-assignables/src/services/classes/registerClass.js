// eslint-disable-next-line no-use-before-define
module.exports = registerClass;

const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const { classes } = require('../tables');

async function registerClass(assignableInstanceId, classId, { userSession, transacting }) {
  const classIds = Array.isArray(classId) ? classId : [classId].filter((id) => id);
  // EN: Check if the assignable instance exists
  // ES: Comprobar si la instancia asignable existe
  const assignableInstance = await getAssignableInstance.call(this, assignableInstanceId, {
    userSession,
    transacting,
  });

  // TODO: Check if class exists

  const now = global.utils.sqlDatetime(new Date());
  // EN: Register the class
  // ES: Registrar la clase
  await classes.createMany(
    classIds.map((id) => ({
      assignableInstance: assignableInstanceId,
      assignable: assignableInstance.assignable,
      class: id,
      date: now,
    })),
    { transacting }
  );

  return {
    assignableInstance: assignableInstanceId,
    assignable: assignableInstance.assignable,
    classes: classIds,
    date: new Date(now),
  };
}
