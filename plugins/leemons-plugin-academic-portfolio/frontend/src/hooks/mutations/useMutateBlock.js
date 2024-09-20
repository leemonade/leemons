import {
  createBlockRequest,
  updateBlockRequest,
  removeBlockRequest,
} from '@academic-portfolio/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSubjectBlocksKey } from '../keys/subjectBlocks';

export function useCreateBlock({ successMessage, successFollowUp }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createBlockRequest(props),
    onSuccess: (data) => {
      if (successMessage) addSuccessAlert(successMessage);
      if (successFollowUp) successFollowUp();

      const queryKey = getSubjectBlocksKey(data.block?.subject);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      addErrorAlert(error.message);
    },
  });
}

export function useUpdateBlock({ successMessage, successFollowUp }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateBlockRequest(props),
    onSuccess: (data) => {
      if (successMessage) addSuccessAlert(successMessage);
      if (successFollowUp) successFollowUp();

      const queryKey = getSubjectBlocksKey(data.data?.subject);
      queryClient.invalidateQueries(queryKey);

      // TODO: Invalidate block detail query as well (when implemented)
    },
    onError: (error) => {
      addErrorAlert(error.message);
    },
  });
}

export function useDeleteBlock({ successMessage, successFollowUp }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => removeBlockRequest(props.id),
    onSuccess: (data, variables) => {
      if (successMessage) addSuccessAlert(successMessage);
      if (successFollowUp) successFollowUp();

      const queryKey = getSubjectBlocksKey(variables.subjectId);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      addErrorAlert(error.message);
    },
  });
}
