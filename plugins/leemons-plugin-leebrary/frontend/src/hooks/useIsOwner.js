import React from 'react';
import useUserAgents from '@users/hooks/useUserAgents';

function useIsOwner(asset) {
  const userAgents = useUserAgents();

  return React.useMemo(() => {
    if (!asset?.canAccess?.length) return false;

    let hasPermission = false;

    asset.canAccess.forEach((user) => {
      user.userAgentIds.forEach((userAgent) => {
        if (userAgents.includes(userAgent) && user.permissions.includes('owner')) {
          hasPermission = true;
        }
      });
    });

    return hasPermission;
  }, [userAgents, asset]);
}

export { useIsOwner };
