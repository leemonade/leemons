async function createGroup(body) {
  return leemons.api('academic-portfolio/group', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateGroup(body) {
  return leemons.api('academic-portfolio/group', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function removeGroupFromClasses(groupId) {
  return leemons.api(`academic-portfolio/group-from-classes-under-node-tree?group=${groupId}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function duplicateGroup(body) {
  return leemons.api(`academic-portfolio/group/duplicate`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export { createGroup, updateGroup, removeGroupFromClasses, duplicateGroup };
