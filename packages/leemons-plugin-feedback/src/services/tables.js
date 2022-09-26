const table = {
  feedbackQuestions: leemons.query('plugins_feedback::feedback-questions'),
  feedbackResponse: leemons.query('plugins_feedback::feedback-responses'),
};

module.exports = { table };
