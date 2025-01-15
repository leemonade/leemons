import { useMemo } from 'react';

import useGetProfileSysName from '@users/helpers/useGetProfileSysName';

function useIsAdmin() {
  const profileSysName = useGetProfileSysName();

  return useMemo(() => profileSysName === 'admin', [profileSysName]);
}

export { useIsAdmin };
export default useIsAdmin;
