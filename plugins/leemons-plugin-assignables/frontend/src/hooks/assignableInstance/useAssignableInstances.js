import { useMemo } from 'react';
import { useApi } from '@common';
import getAssignableInstances from '../../requests/assignableInstances/getAssignableInstances';

export default function useAssignableInstances(ids, details = true) {
  const options = useMemo(
    () => ({
      ids,
      details,
    }),
    [ids, details]
  );

  const [assignableInstances] = useApi(getAssignableInstances, options);

  return assignableInstances;
}
