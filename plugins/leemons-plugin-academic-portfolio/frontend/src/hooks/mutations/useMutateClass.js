import { createClassRequest } from '@academic-portfolio/request';
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

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createClassRequest(props),
    onSuccess: (data) => {
      const queryKey = getProgramSubjectsKey(data.class?.program);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

// export function useArchiveProgram() {
//   return useMutation({
//     mutationFn: async (props) => deleteSubjectTypeRequest(props),
//   });
// }
