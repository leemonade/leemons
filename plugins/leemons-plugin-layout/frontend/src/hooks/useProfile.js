import { getCookieToken } from "@users/session";

export default function useProfile() {
  const token = getCookieToken(true);

  if (!token) {
    return { id: null, profile: null, hasOtherProfiles: false };
  }

  const { profile, profiles, centers } = token;
  let profileData = null;
  let hasOtherProfiles = false;

  if (profiles?.length) {
    profileData = profiles.find(({ id }) => id === profile);
    hasOtherProfiles = profiles?.length > 1;
  }

  if (!profileData && centers?.length) {
    const profiles = centers.flatMap((center) => center.profiles).filter(Boolean);
    profileData = profiles.find(({ id }) => id === profile);
    hasOtherProfiles = profiles?.length > 1;
  }

  return { id: profile, profile: profileData, hasOtherProfiles };
}
