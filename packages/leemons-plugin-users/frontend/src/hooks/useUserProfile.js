import { useQuery } from 'react-query';

export function useUserProfile() {
  return useQuery('user profile', () => localStorage.getItem('currentProfile') || null);
}

export default useUserProfile;
