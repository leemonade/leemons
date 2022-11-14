import { useQuery } from '@tanstack/react-query';
import { getCookieToken } from '@users/session';
import searchAssignableInstances from '../../requests/assignableInstances/searchAssignableInstances';

export default function useSearchAssignableInstances(query = {}, { enabled = true } = {}) {
  // EN: This will work as long as only 1 center is selected
  // ES: Esto funcionará siempre que solo se seleccione un centro
  const token = getCookieToken(true);
  const userId = token.centers[0].userAgentId;

  // const [assignableInstances, , loading] = useApi(searchAssignableInstances, query);
  return useQuery(
    ['searchAssignableInstances', { query, userId }],
    () => searchAssignableInstances(query),
    {
      enabled,
    }
  );
}
