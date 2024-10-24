import { getUserFullName } from "@bubbles-ui/components";
import { useUserAgents, useUserAgentsInfo } from "@users/hooks";

import useProfile from "./useProfile";

export default function useUserInfo() {
  const userAgents = useUserAgents();
  const {
    data: userAgentsInfo,
    isLoading,
    refetch,
  } = useUserAgentsInfo(userAgents, {
    enabled: !!userAgents,
  });

  if (userAgents?.length && !userAgentsInfo?.length) {
    refetch();
  }

  const { profile, hasOtherProfiles } = useProfile();

  const name = userAgentsInfo?.[0]?.user ? getUserFullName(userAgentsInfo[0].user) : '';

  return { isLoading: isLoading || !name, name, profile: profile?.name, hasOtherProfiles };
}
