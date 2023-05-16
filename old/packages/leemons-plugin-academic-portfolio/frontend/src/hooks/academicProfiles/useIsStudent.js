import { useUserProfile } from '@users/hooks';
import useAcademicProfiles from './useAcademicProfiles';

export default function useIsStudent() {
  const { student, isLoading: academicProfilesAreLoading } = useAcademicProfiles();
  const { data: userProfile, isLoading: userProfileIsLoading } = useUserProfile();

  if (academicProfilesAreLoading || userProfileIsLoading) {
    return null;
  }

  return userProfile === student;
}
