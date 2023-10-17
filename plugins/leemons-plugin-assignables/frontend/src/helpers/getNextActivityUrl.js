import getAssignation from '@assignables/requests/assignations/getAssignation';

export default async function getNextActivityUrl(assignation) {
  const nextActivity = assignation?.instance?.relatedAssignableInstances?.after?.[0];

  if (!nextActivity) {
    return null;
  }

  const { id } = nextActivity;
  const { user } = assignation;

  const nextAssignation = await getAssignation({ id, user });
  const role = nextAssignation?.instance?.assignable?.roleDetails;

  if (!nextAssignation) {
    return null;
  }

  return role.studentDetailUrl.replace(':id', id).replace(':user', user);
}
