import { useMemo } from 'react';
import { useApi } from '@common';
import getDeliverableRequest from '../../../../request/instance/getDeliverable';

export default function useDeliverable(instance, student, type) {
  const options = useMemo(
    () => ({
      instance,
      student,
      type,
    }),
    [instance, student, type]
  );
  const [deliverable] = useApi(getDeliverableRequest, options);

  return deliverable?.deliverable;
}
