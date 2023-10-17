import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import hooks from 'leemons-hooks';

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let saving = false;
    const onUserChangeProfile = ({ args: [currentProfile] }) => {
      saving = true;
      localStorage.setItem('currentProfile', currentProfile.id);
      queryClient.setQueryData(['user profile'], currentProfile.id);
    };

    const onUserCookieChange = () => {
      if (!saving) {
        localStorage.removeItem('currentProfile');
        queryClient.invalidateQueries(['user profile']);
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
}

export default useUpdateUserProfile;
