import { useState, useEffect } from 'react';
import { getProfiles } from '@academic-portfolio/request/settings';
import { useApi } from '@common';
import hooks from 'leemons-hooks';

export default function useIsTeacher() {
  const [response, , , reload] = useApi(getProfiles);
  const [profile, setProfile] = useState();

  const teacherProfile = response?.profiles?.teacher;

  /**
   * Get teacher profile from localStorage on first render
   */
  useEffect(() => {
    const currentProfile = localStorage.getItem('currentProfile');

    if (currentProfile && currentProfile !== profile) {
      setProfile(currentProfile);
    }
  }, []);

  /**
   * On other renders, get the teacher profile from the emitted event
   */
  useEffect(() => {
    hooks.addAction('user:change:profile', ({ args: [currentProfile] }) => {
      setTimeout(() => {
        if (!teacherProfile) {
          reload();
        }

        if (currentProfile.id !== profile) {
          localStorage.setItem('currentProfile', currentProfile.id);
          setProfile(currentProfile.id);
        }
      }, 1000);
    });
  }, []);

  leemons.log.debug(
    'currentProfile: ',
    profile,
    'teacherProfile: ',
    teacherProfile,
    'isTeacher: ',
    profile === teacherProfile
  );

  return profile === teacherProfile;
}
