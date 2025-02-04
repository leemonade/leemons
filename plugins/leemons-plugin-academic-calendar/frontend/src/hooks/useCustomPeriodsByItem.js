import { useQuery } from '@tanstack/react-query';

import { getCustomPeriodsByItemKey } from './keys/customPeriodsByItem';

import { getCustomPeriodByItemRequest } from '@academic-calendar/request';

export const useCustomPeriodsByItem = (item, options = {}) => {
  const queryKey = getCustomPeriodsByItemKey(item);

  const queryFn = () => getCustomPeriodByItemRequest(item).then((res) => res.data);

  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};

export default useCustomPeriodsByItem;
