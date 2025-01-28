const oneDay = 60 * 60 * 24;
const oneMonth = oneDay * 30;

module.exports = {
  assignables: {
    get: oneMonth,
  },
  instances: {
    get: oneMonth,
  },
  assignations: {
    get: oneMonth,
  },
};
