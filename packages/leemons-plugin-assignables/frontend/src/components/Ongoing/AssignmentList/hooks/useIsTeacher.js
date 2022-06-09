import { useEffect } from 'react';
import { getProfiles } from '@academic-portfolio/request/settings';
import { useQuery, useQueryClient } from 'react-query';
import hooks from 'leemons-hooks';

function useTeacherProfile() {
  const { data, isLoading } = useQuery('plugins.academic-portfolio.profiles', getProfiles);

  const profiles = isLoading ? null : data?.profiles;

  const teacherProfile = isLoading ? null : profiles?.teacher;

  return { isLoading, data: teacherProfile };
}

function useUserProfile() {
  return useQuery('user profile', () => localStorage.getItem('currentProfile') || null);
}

export default function useIsTeacher() {
  const queryClient = useQueryClient();
  // const [response, , , reload] = useApi(getProfiles);
  const { data: teacherProfile, isLoading: isLoadingTeacherProfile } = useTeacherProfile();
  const { data: profile, isLoadingUserProfile } = useUserProfile();

  /**
   * On other renders, get the teacher profile from the emitted event
   */
  useEffect(() => {
    let saving = false;
    const onUserChangeProfile = ({ args: [currentProfile] }) => {
      saving = true;
      localStorage.setItem('currentProfile', currentProfile.id);
      queryClient.setQueryData('user profile', currentProfile.id);
    };

    const onUserCookieChange = () => {
      if (!saving) {
        localStorage.removeItem('currentProfile');
        queryClient.invalidateQueries('user profile');
      } else {
        saving = false;
      }
    };

    hooks.addAction('user:change:profile', onUserChangeProfile);
    hooks.addAction('user:cookie:session:change', onUserCookieChange);

    return () => {
      hooks.removeAction('user:change:profile', onUserChangeProfile);
      hooks.removeAction('user:cookie:session:change', onUserCookieChange);
    };
  }, []);

  leemons.log.debug(
    'currentProfile: ',
    profile,
    'teacherProfile: ',
    teacherProfile,
    'isTeacher: ',
    profile === teacherProfile
  );

  if (isLoadingTeacherProfile || isLoadingUserProfile) {
    return null;
  }

  return profile === teacherProfile;
}
