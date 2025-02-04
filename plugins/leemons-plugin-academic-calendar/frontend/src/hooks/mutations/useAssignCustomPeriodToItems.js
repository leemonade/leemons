import { useMutation } from '@tanstack/react-query';

import { assignToItemsRequest } from '@academic-calendar/request';

function useAssignCustomPeriodToItems() {
  return useMutation({
    mutationFn: (payload) => assignToItemsRequest(payload),
  });
}

export { useAssignCustomPeriodToItems };
