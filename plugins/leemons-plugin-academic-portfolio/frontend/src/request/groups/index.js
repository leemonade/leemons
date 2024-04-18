async function createGroup(body) {
  return leemons.api('v1/academic-portfolio/groups', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateGroup(body) {
  return leemons.api('v1/academic-portfolio/groups', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function getGroupById(groupId) {
  return leemons.api(`v1/academic-portfolio/groups/${groupId}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function removeGroupFromClasses(groupId) {
  return leemons.api(
    `v1/academic-portfolio/groups/group-from-classes-under-node-tree?group=${groupId}`,
    {
      allAgents: true,
      method: 'DELETE',
    }
  );
}

async function duplicateGroup(body) {
  return leemons.api(`v1/academic-portfolio/groups/duplicate`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export { createGroup, updateGroup, getGroupById, removeGroupFromClasses, duplicateGroup };
