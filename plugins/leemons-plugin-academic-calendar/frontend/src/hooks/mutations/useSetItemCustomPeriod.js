import { useMutation } from '@tanstack/react-query';

import { setItemCustomPeriodRequest } from '@academic-calendar/request';

function useSetItemCustomPeriod() {
  return useMutation({
    mutationFn: (payload) => setItemCustomPeriodRequest(payload),
  });
}

export { useSetItemCustomPeriod };
