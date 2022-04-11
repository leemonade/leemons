const { userDeliverables } = require('../../../table');

module.exports = async function getDeliverable({ instance, user, type }, { transacting } = {}) {
  const deliverable = await userDeliverables.find(
    {
      instance,
      user,
      type,
    },
    { transacting }
  );

  if (!deliverable?.length) {
    return null;
  }

  return JSON.parse(deliverable[0].deliverable);
};
