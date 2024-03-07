module.exports = function saveCorrectionRequest(instance, student, { grade, teacherFeedback }) {
  return leemons.api(`v1/tasks/tasks/instances/${instance}/students/${student}/calification`, {
    allAgents: true,
    method: 'POST',
    body: {
      grade,
      teacherFeedback,
    },
  });
};
