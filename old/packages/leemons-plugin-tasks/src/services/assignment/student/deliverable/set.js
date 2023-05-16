const { userDeliverables } = require('../../../table');

module.exports = async function setDeliverable(
  { instance, user, deliverable, type },
  { transacting } = {}
) {
  return userDeliverables.set(
    {
      instance,
      user,
      type,
    },
    {
      deliverable: JSON.stringify({ deliverable }),
    },
    {
      transacting,
    }
  );
};
