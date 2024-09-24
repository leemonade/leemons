import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getProgramNomenclatureKey } from '../keys/programNomenclature';
import { getProgramSubjectsKey } from '../keys/programSubjects';

import { setProgramCustomTranslationKeysRequest } from '@academic-portfolio/request';

function useSetProgramCustomTranslationKeys({ successMessage, successFollowUp }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ programId, prefix, localizations }) =>
      setProgramCustomTranslationKeysRequest({ id: programId, prefix, localizations }),
    onSuccess: (data, variables) => {
      if (variables.programId) {
        const programSubjectsKey = getProgramSubjectsKey(variables.programId);
        queryClient.invalidateQueries(programSubjectsKey);

        const programNomenclatureKey = getProgramNomenclatureKey(variables.programId, true);
        queryClient.invalidateQueries(programNomenclatureKey);
      }

      if (successMessage) addSuccessAlert(successMessage);
      if (successFollowUp) successFollowUp();
    },
    onError: (error) => {
      addErrorAlert(error.message);
    },
  });
}

export default useSetProgramCustomTranslationKeys;
