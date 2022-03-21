module.exports = function correctionRequest(instance, student, { grade, teacherFeedback }) {
  return leemons.api(`tasks/tasks/instances/${instance}/students/${student}/calification`, {
    allAgents: true,
    method: 'POST',
    body: {
      grade,
      teacherFeedback,
    },
  });
};
