const { tables } = require('../tables');

async function getByUser(userId, { transacting } = {}) {
  const results = await tables.files.find({ fromUser: userId }, { transacting });
  return results.map((item) => {
    const data = { ...item };
    if (data.metadata) data.metadata = JSON.parse(data.metadata);
    return data;
  });
}

module.exports = { getByUser };
