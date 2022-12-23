import { useMemo } from 'react';
import { useUserProfile } from '@users/hooks';
import useAcademicProfiles from './useAcademicProfiles';

export default function useIsAcademicProfile() {
  const { isLoading: academicProfilesAreLoading, ...profiles } = useAcademicProfiles();
  const { data: userProfile, isLoading: userProfileIsLoading } = useUserProfile();

  const profilesValues = useMemo(() => Object.values(profiles), [profiles]);

  return useMemo(() => {
    if (academicProfilesAreLoading || userProfileIsLoading) {
      return null;
    }

    return profilesValues.includes(userProfile);
  }, [profilesValues, userProfile]);
}
