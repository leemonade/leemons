import { getSubjectDetails } from '@academic-portfolio/request/subjects';
import { useQuery } from '@tanstack/react-query';

export default function useSubjectDetails(subjectId, { enabled = true } = {}) {
  const query = useQuery(
    ['subjectDetail', { subject: subjectId }],
    async () => {
      const response = await getSubjectDetails(subjectId);

      if (Array.isArray(subjectId) && Array.isArray(response.data)) {
        const detailsById = response.data.reduce(
          (obj, subject) => ({ ...obj, [subject.id]: subject }),
          {}
        );

        return subjectId.map((subject) => detailsById[subject]);
      }

      return response.data;
    },
    { enabled }
  );

  return query;
}
