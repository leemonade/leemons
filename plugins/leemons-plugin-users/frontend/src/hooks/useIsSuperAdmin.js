import React from 'react';

import { useUserAgentsInfo } from '@users/hooks';
import useUserDetails from '@users/hooks/useUserDetails';
import { getSessionUserAgent } from '@users/session';

function useIsSuperAdmin() {
  const userAgentId = getSessionUserAgent();

  const { data: userAgentInfo } = useUserAgentsInfo([userAgentId], {
    enabled: !!userAgentId,
  });

  const [userAgent] = userAgentInfo ?? [];
  const enableUserDetails = !!userAgent?.user?.id;

  const { data: userDetails } = useUserDetails({
    userId: userAgent?.user?.id,
    enabled: enableUserDetails,
  });

  return React.useMemo(() => {
    const superAdmin = userDetails?.userAgents?.find((ua) => ua.profile?.sysName === 'super');
    return !!superAdmin;
  }, [userDetails]);
}

export { useIsSuperAdmin };
