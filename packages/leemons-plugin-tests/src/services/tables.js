const table = {
  questionsBanks: leemons.query('plugins_tests::questions-banks'),
  questions: leemons.query('plugins_tests::questions'),
};

module.exports = { table };
