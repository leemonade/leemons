const getAssignableInstances = require('./getAssignableInstances');

module.exports = async function getAssignableInstance(
  id,
  { relatedAssignableInstances, details, userSession, transacting } = {}
) {
  const instances = await getAssignableInstances([id], {
    relatedAssignableInstances,
    details,
    userSession,
    transacting,
  });

  return instances[0];
};
