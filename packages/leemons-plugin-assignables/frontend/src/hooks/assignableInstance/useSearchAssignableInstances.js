import { useMemo } from 'react';
import { useApi } from '@common';
import searchAssignableInstances from '../../requests/assignableInstances/searchAssignableInstances';

export default function useSearchAssignableInstances() {
  const options = useMemo(() => ({}), []);
  const defaultReturn = useMemo(() => [], []);
  const [assignableInstances] = useApi(searchAssignableInstances, options);

  return assignableInstances || defaultReturn;
}
