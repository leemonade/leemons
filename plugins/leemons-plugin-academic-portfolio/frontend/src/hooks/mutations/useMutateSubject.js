import { createSubjectRequest } from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgramSubjectsKey } from '../keys/programSubjects';

// import { getCenterProgramsKey } from '../keys/centerPrograms';

// export function useUpdateProgram() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (props) => updateProgramRequest(props),
//     onSuccess: (data) => {
//       // Invaidate subject-types query for that center
//       const queryKey = getSubjectTypesKey(data.subjectType.center);
//       queryClient.invalidateQueries(queryKey);
//     },
//   });
// }

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createSubjectRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.subject?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

// export function useArchiveProgram() {
//   return useMutation({
//     mutationFn: async (props) => deleteSubjectTypeRequest(props),
//   });
// }
