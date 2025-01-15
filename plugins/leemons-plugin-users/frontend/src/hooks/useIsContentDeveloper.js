import { useMemo } from 'react';

import useGetProfileSysName from '@users/helpers/useGetProfileSysName';

function useIsContentDeveloper() {
  const profileSysName = useGetProfileSysName();

  return useMemo(() => profileSysName === 'content-developer', [profileSysName]);
}

export { useIsContentDeveloper };
export default useIsContentDeveloper;
