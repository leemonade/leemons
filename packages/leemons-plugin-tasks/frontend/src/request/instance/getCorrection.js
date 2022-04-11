module.exports = function getCorrectionRequest(instance, student) {
  return leemons.api(`tasks/tasks/instances/${instance}/students/${student}/calification`, {
    allAgents: true,
    method: 'GET',
  });
};
