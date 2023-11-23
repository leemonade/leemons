import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDocumentRequest } from '@content-creator/request';
import { getDocumentKey } from '../keys/document';

export default function useMutateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => saveDocumentRequest(props),
    onSuccess: (data) => {
      const queryKey = getDocumentKey(data.document.assignable);
      queryClient.invalidateQueries(queryKey);
    },
  });
}
