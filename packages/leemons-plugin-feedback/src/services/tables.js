const table = {
  feedback: leemons.query('plugins_feedback::feedback'),
  feedbackQuestions: leemons.query('plugins_feedback::feedback-questions'),
};

module.exports = { table };
