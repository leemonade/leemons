import { useMemo } from 'react';
import { useApi } from '@common-frontend-react';
import getCorrectionRequest from '../../../request/instance/getCorrection';

export default function useCorrection(instance, student) {
  const req = useMemo(() => () => getCorrectionRequest(instance, student), [instance, student]);
  const [correction] = useApi(req);

  return correction?.calification;
}
