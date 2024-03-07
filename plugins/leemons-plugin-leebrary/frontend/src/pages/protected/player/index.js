import React, { useMemo } from 'react';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { AssetPlayerWrapper } from '@leebrary/components/AssetPlayerWrapper';
import { useAsset } from '@leebrary/request/hooks/queries/useAsset';
import useCategories from '../../../request/hooks/queries/useCategories';
import { prepareAsset } from '../../../helpers/prepareAsset';

function PlayerPage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const { assetId } = useParams();
  const { data: asset, isLoading } = useAsset({
    id: assetId,
    showPublic: true,
  });
  const category = useMemo(
    () => categories?.find((cat) => cat.id === asset?.category) || {},
    [asset, categories]
  );
  const assetData = prepareAsset(asset);

  if (isLoading && isCategoriesLoading) {
    return <LoadingOverlay visible />;
  }
  return (
    <Box>
      {assetData?.id && category ? (
        <AssetPlayerWrapper asset={assetData} category={category} />
      ) : null}
    </Box>
  );
}

export default PlayerPage;
export { PlayerPage };
