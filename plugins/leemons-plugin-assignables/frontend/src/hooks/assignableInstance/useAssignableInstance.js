import { useMemo } from 'react';
import { useApi } from '@common';
import getAssignableInstance from '../../requests/assignableInstances/getAssignableInstance';

export default function useAssignableInstance(id, details = true) {
  const options = useMemo(
    () => ({
      id,
      details,
    }),
    [id, details]
  );

  const [assignableInstance] = useApi(getAssignableInstance, options);

  return assignableInstance;
}
