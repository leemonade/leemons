import React from 'react';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';

export default function useActivitiesByProfile(instances) {
  const queriesData = useAssignationsByProfile(instances);

  const defaultValue = React.useMemo(() => [], []);

  const isLoading = React.useMemo(
    () => !queriesData || queriesData?.some((query) => query.isLoading),
    [queriesData]
  );
  const data = React.useMemo(() => {
    if (isLoading) {
      return defaultValue;
    }
    return queriesData.map((query) => query.data);
  }, [queriesData]);

  return { isLoading, data };
}
