import { getSubjectDetails } from '@academic-portfolio/request/subjects';
import { useQuery } from 'react-query';

export default function useSubjectDetails(subjectId, { enabled = true } = {}) {
  const query = useQuery(
    ['subjectDetail', { subject: subjectId }],
    async () => {
      const response = await getSubjectDetails(subjectId);

      return response.data;
    },
    { enabled }
  );

  return query;
}
