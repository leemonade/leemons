import { useMemo } from 'react';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';

export const useModuleActivities = ({ module }) => {
  if (!module) return [];
  const activitiesIds = useMemo(
    () => module?.submission?.activities.map((a) => a.activity),
    [module?.submission?.activities]
  );
  const { data } = useAssignables({ ids: activitiesIds });
  const activities = useMemo(() => {
    const object = {};

    data?.forEach((activity) => {
      object[activity.id] = activity;
    });

    return object;
  }, [data]);

  return useMemo(() => activitiesIds.map((id) => activities[id]), [activitiesIds, data]);
};
export default useModuleActivities;
