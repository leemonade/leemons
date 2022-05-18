import { getProfiles } from '@academic-portfolio/request/settings';
import { useApi } from '@common';
import { getCookieToken } from '@users/session';

export default function useIsTeacher() {
  const [response] = useApi(getProfiles);
  const token = getCookieToken(true);
  const profile = token.centers[0].profiles[0].id;
  const teacherProfile = response?.profiles?.teacher;

  return profile === teacherProfile;
}
