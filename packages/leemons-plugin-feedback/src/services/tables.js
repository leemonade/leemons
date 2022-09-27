const table = {
  feedbackQuestions: leemons.query('plugins_feedback::feedback-questions'),
  feedbackResponse: leemons.query('plugins_feedback::feedback-responses'),
  feedbackDates: leemons.query('plugins_feedback::feedback-dates'),
};

module.exports = { table };
