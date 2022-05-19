/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');

async function initTests({ users, programs }) {
  const { services } = leemons.getPlugin('tests');

  try {
    // ·····················································
    // QBANKS

    const qbanks = await importQbanks(programs);
    const qbanksKeys = keys(qbanks);

    for (let i = 0, len = qbanksKeys.length; i < len; i++) {
      const key = qbanksKeys[i];
      const { creator, ...qbank } = qbanks[key];
      const qbankData = await services.questionsBanks.save(
        { ...qbank, published: true, questions: [] },
        {
          userSession: users[creator],
        }
      );
      qbanks[key] = { ...qbankData };
    }

    // ·····················································
    // TESTS

    let tests = {
      test01: {
        qbanks,
      },
    };

    return tests;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTests;
