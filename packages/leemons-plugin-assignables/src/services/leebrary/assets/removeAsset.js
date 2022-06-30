const leebrary = require('../leebrary');

module.exports = async function removeAsset(id, { userSession, transacting } = {}) {
  return leebrary().assets.remove(id, { soft: false, userSession, transacting });
};
