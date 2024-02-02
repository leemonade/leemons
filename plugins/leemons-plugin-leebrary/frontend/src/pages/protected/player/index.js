import React, { useMemo } from 'react';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { AssetPlayerWrapper } from '@leebrary/components/AssetPlayerWrapper';
import { useAssets } from '../../../request/hooks/queries/useAssets';
import useCategories from '../../../request/hooks/queries/useCategories';

function PlayerPage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const { assetId } = useParams();
  const { data: assets, isLoading } = useAssets({
    ids: [assetId],
    // filters: {
    //   showPublic: true,
    //   indexable: false,
    // },
  });
  const category = useMemo(
    () => categories?.find((cat) => cat.id === assets?.[0]?.category) || {},
    [assets, categories]
  );

  if (isLoading && isCategoriesLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box>
      {assets?.length && category && <AssetPlayerWrapper asset={assets[0]} category={category} />}
    </Box>
  );
}

export default PlayerPage;
export { PlayerPage };
