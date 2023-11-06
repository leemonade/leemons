module.exports = function getCorrectionRequest(instance, student) {
  return leemons.api(`v1/tasks/tasks/instances/${instance}/students/${student}/calification`, {
    allAgents: true,
    method: 'GET',
  });
};
