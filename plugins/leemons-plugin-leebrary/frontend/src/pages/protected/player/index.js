import React from 'react';
import { Box } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { useAssets } from '../../../request/hooks/queries/useAssets';

function PlayerPage() {
  const { assetId } = useParams();
  const { data: asset } = useAssets({ ids: [assetId] });
  console.log(asset);
  // TODO: Traerse el detalle del assetID, y renderizar el player

  return <Box>Aquí debería ir un AssetPlayer para reproducir el AssetID: {assetId}</Box>;
}

export default PlayerPage;
export { PlayerPage };
