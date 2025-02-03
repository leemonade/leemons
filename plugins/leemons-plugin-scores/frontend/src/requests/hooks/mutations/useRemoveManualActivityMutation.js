import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { classManualActivitiesKey } from '../keys/manualActivities';

import { prefixPN } from '@scores/helpers';
import { removeManualActivity } from '@scores/requests/manualActivities/remove';

export function useRemoveManualActivityMutation() {
  const queryClient = useQueryClient();
  const [t] = useTranslateLoader(prefixPN('mutations.removeManualActivity'))

  return useMutation({
    mutationFn: removeManualActivity,
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: classManualActivitiesKey({ classId }),
      });

      addSuccessAlert(t('success'));
    },
    onError: () => {
      addErrorAlert(t('error'));
    },
  });
}
