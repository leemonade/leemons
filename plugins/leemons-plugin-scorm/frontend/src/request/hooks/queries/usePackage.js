import { useQuery } from '@tanstack/react-query';
import { getPackageRequest } from '@scorm/request';
import { getPackageKey } from '../keys/packages';

export default function usePackage({ id, ...options }) {
  const queryKey = getPackageKey(id);

  const queryFn = () => getPackageRequest(id).then((request) => request.scorm);

  return useQuery({
    ...options,
    queryKey,
    queryFn,
  });
}
