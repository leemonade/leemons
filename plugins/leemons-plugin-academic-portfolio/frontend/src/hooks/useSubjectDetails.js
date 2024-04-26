import { getSubjectDetails } from '@academic-portfolio/request/subjects';
import { useQuery } from '@tanstack/react-query';

export default function useSubjectDetails(
  subjectId,
  { enabled = true, refetchOnWindowFocus = true } = {},
  withClasses = false,
  showArchived = false
) {
  return useQuery(
    ['subjectDetail', { subject: subjectId, withClasses, showArchived }],
    async () => {
      const response = await getSubjectDetails(subjectId, withClasses, showArchived);

      if (Array.isArray(subjectId) && Array.isArray(response.data)) {
        const detailsById = response.data.reduce(
          (obj, subject) => ({ ...obj, [subject.id]: subject }),
          {}
        );

        return subjectId.map((subject) => detailsById[subject]);
      }
      return response.data;
    },
    { enabled, refetchOnWindowFocus }
  );
}
