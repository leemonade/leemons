import { useMemo } from 'react';
import { useApi } from '@common';
import searchAssignableInstances from '../../requests/assignableInstances/searchAssignableInstances';

export default function useSearchAssignableInstances(query = {}) {
  const defaultReturn = useMemo(() => [], []);
  const [assignableInstances, , loading] = useApi(searchAssignableInstances, query);

  return [assignableInstances || defaultReturn, loading];
}
