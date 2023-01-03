import useAssignations from './assignations/useAssignationsQuery';

export default function useNextActivityUrl(assignation) {
  const nextActivity = assignation?.instance?.relatedAssignableInstances?.after?.[0];
  const id = nextActivity?.id;
  const { user } = assignation;

  const { data: nextAssignation } = useAssignations({ instance: id, user }, true, {
    enabled: !!id,
  });

  const role = nextAssignation?.instance?.assignable?.roleDetails;

  if (!nextAssignation) {
    return null;
  }

  return role.studentDetailUrl.replace(':id', id).replace(':user', user);
}
