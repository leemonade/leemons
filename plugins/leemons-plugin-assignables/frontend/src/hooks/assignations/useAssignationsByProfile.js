import { getCookieToken } from '@users/session';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';

/**
 *
 * @param {string[]} ids
 * @param {import('@tanstack/react-query').QueryOptions} param1
 * @returns
 */
export default function useAssignationsByProfile(ids, { ...options } = {}) {
  const isTeacher = useIsTeacher();

  const token = getCookieToken(true);
  const user = token.centers[0].userAgentId;

  if (isTeacher) {
    return useInstances({ ...options, ids, details: true });
  }
  return useAssignations({
    ...options,
    queries: ids?.map((id) => ({ instance: id, user })),
    details: true,
    fetchInstance: true,
  });
}
