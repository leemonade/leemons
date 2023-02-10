const { scormProgress } = require('../../tables');

module.exports = async function getScormAssignation(
  { instance, user },
  { userSession, transacting }
) {
  const [assignation, scormStatus] = await Promise.all([
    leemons
      .getPlugin('assignables')
      .services.assignations.getAssignation(instance, user, { userSession, transacting }),
    scormProgress.find(
      {
        instance,
        user,
      },
      { transacting }
    ),
  ]);

  return {
    assignation,
    scormStatus: scormStatus[0]?.state ?? null,
  };
};
