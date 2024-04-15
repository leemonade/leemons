import { useMutation, useQueryClient } from '@tanstack/react-query';

import setWeight from '@scores/requests/weights/setWeight';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { allWeightsKey } from '../keys/weights';

export default function useWeightMutation() {
  const queryClient = useQueryClient();
  const [t] = useTranslateLoader(prefixPN('weightingAlerts'));

  return useMutation({
    mutationFn: ({ class: classId, weight }) => setWeight({ class: classId, weight }),
    onSuccess: () => {
      queryClient.invalidateQueries(allWeightsKey);
      addSuccessAlert(t('updateSuccess'));
    },
    onError: (e) => {
      addErrorAlert(t('updateError'), e.message);
    },
  });
}
