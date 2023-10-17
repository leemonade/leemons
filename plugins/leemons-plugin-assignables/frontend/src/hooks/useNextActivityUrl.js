import useAssignations from '@assignables/requests/hooks/queries/useAssignations';

export default function useNextActivityUrl(assignation) {
  const nextActivity = assignation?.instance?.relatedAssignableInstances?.after?.[0];
  const id = nextActivity?.id;
  const { user } = assignation ?? {};

  const { data: nextAssignation } = useAssignations({
    query: { instance: id, user },
    details: true,
    fetchInstance: true,
    enabled: !!id,
  });

  const role = nextAssignation?.instance?.assignable?.roleDetails;

  if (!nextAssignation) {
    return null;
  }

  return role.studentDetailUrl.replace(':id', id).replace(':user', user);
}
