const getAssignableInstances = require('./getAssignableInstances');

module.exports = async function getAssignableInstance(
  id,
  { relatedAssignableInstances, details, userSession, transacting } = {}
) {
  try {
    const instances = await getAssignableInstances([id], {
      relatedAssignableInstances,
      details,
      userSession,
      transacting,
    });

    return instances[0];
  } catch (e) {
    console.log(e);
    throw e;
  }
};
