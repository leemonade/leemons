import { useQuery } from '@tanstack/react-query';

import { listPrograms } from '../request/programs';

export default function useProgramsList(
  { page, size, center, onlyArchived },
  { queryOptions = {} } = {}
) {
  return useQuery(
    ['programsList', page, size, center, onlyArchived],
    () => listPrograms({ page, size, center, onlyArchived }),
    {
      ...queryOptions,
      keepPreviousData: true,
    }
  );
}
