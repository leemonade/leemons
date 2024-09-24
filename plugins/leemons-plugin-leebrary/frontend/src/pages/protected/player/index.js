import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Box, LoadingOverlay } from '@bubbles-ui/components';

import { prepareAsset } from '../../../helpers/prepareAsset';
import useCategories from '../../../request/hooks/queries/useCategories';

import { AssetPlayerWrapper } from '@leebrary/components/AssetPlayerWrapper';
import { useAsset } from '@leebrary/request/hooks/queries/useAsset';

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
