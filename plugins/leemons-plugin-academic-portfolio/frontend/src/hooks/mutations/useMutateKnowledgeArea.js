import {
  createKnowledgeAreaRequest,
  deleteKnowledgeAreaRequest,
  updateKnowledgeAreaRequest,
} from '@academic-portfolio/request';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { allKnowledgeAreaKeys, getKnowledgeAreasKey } from '../keys/knowledgeAreas';

export function useCreateKnowledgeArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => createKnowledgeAreaRequest(props),
    onSuccess: (data) => {
      // Invalidate knowledge-areas query for that center
      const queryKey = getKnowledgeAreasKey(data.knowledge.center);
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useUpdateKnowledgeArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props) => updateKnowledgeAreaRequest(props),
    onSuccess: () => {
      const queryKey = allKnowledgeAreaKeys;
      queryClient.invalidateQueries(queryKey);
    },
  });
}

export function useDeleteKnowledgeArea() {
  return useMutation({
    mutationFn: async (props) => deleteKnowledgeAreaRequest(props),
  });
}
