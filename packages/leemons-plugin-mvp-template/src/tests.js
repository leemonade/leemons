/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');

async function initTests({ programs }) {
  const { services } = leemons.getPlugin('tests');

  try {
    // ·····················································
    // QBANKS

    let qbanks = await importQbanks(programs);
    console.log('-- QBANKS --');
    console.dir(qbanks, { depth: null });
    // qbanks = await services.questionBanks.save(qbanks);

    // ·····················································
    // TESTS

    let tests = [];

    return tests;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTests;
