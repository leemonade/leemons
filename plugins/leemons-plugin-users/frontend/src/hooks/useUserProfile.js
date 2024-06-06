import { getSessionProfile } from '@users/session';

export function useUserProfile() {
  const sessionProfile = getSessionProfile();

  return { data: sessionProfile?.id, loading: !sessionProfile };
}

export default useUserProfile;
