import React from 'react';
import useUserAgents from '@users/hooks/useUserAgents';

function useIsOwner(asset, useCreationAsOwnership = true) {
  const userAgents = useUserAgents();

  return React.useMemo(() => {
    if (!asset?.canAccess?.length) {
      return useCreationAsOwnership
        ? userAgents.some((userAgent) => userAgent === asset?.fromUserAgent)
        : false;
    }

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
