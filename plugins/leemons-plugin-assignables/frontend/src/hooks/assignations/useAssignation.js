import { useMemo } from 'react';
import { useApi } from '@common';
import getAssignation from '../../requests/assignations/getAssignation';

export default function useAssignation(instance, user, details = true) {
  const options = useMemo(
    () => ({
      id: instance,
      user,
      details,
    }),
    [instance, user, details]
  );
  return useApi(getAssignation, options);
}
