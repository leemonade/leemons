import React from 'react';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { AssetPlayer } from '@leebrary/components/AssetPlayer';
import { useAssets } from '../../../request/hooks/queries/useAssets';

function PlayerPage() {
  const { assetId } = useParams();
  const { data: assets, isLoading } = useAssets({
    ids: [assetId],
    filters: {
      showPublic: true,
      indexable: false,
    },
  });

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return <Box>{assets?.length && <AssetPlayer asset={assets[0]} />}</Box>;
}

export default PlayerPage;
export { PlayerPage };
