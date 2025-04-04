import { useVariantForQueryKey } from "@common/queries";
import { useQuery } from "@tanstack/react-query";

import { getDocumentKey } from "../keys/document";

import { getDocumentRequest } from "@content-creator/request";

export default function useDocument({ id, isNew, ...options }) {
  const queryKey = getDocumentKey(id);

  useVariantForQueryKey(queryKey, {
    modificationTrend: "frequently",
  });

  const queryFn = async () => {
    const response = await getDocumentRequest(id);
    return response?.document ?? null;
  };

  const query = useQuery({
    ...options,
    queryKey,
    queryFn,
    enabled: !!id && !isNew && options.enabled !== false,
  });

  if (isNew) {
    return { data: null, isLoading: false };
  }

  return query;
}
