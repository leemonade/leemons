import getAssignableInstance from '../assignableInstances/getAssignableInstance';

export default async function getAssignation({ id, user, details = true }) {
  const response = await leemons.api(`assignables/assignableInstances/${id}/assignations/${user}`, {
    method: 'GET',
    allAgents: true,
  });

  if (!response) {
    return [];
  }

  let { assignations } = response;

  if (details) {
    assignations = {
      ...assignations,
      instance: await getAssignableInstance({ id: assignations.instance, details: true }),
    };
  }
  return assignations;
}
