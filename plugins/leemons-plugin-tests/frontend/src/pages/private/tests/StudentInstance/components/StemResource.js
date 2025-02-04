import { useMemo } from 'react';

import { Stack } from '@bubbles-ui/components';
import { AssetPlayerWrapperCCreator } from '@leebrary/components/LibraryTool/AssetPlayerWrapperCCreator';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAsset from '@leebrary/request/hooks/queries/useAsset';
import PropTypes from 'prop-types';

const PLAYER_WIDTHS = {
  image: 406,
  audio: 812,
  video: 812,
};

export default function StemResource({ asset, playerWidth }) {
  const { data: resourceAsset } = useAsset({
    id: asset,
    showPublic: true,
    enabled: !!asset && typeof asset === 'string',
  });

  const preparedResource = useMemo(() => {
    if (typeof asset === 'string' && resourceAsset) return prepareAsset(resourceAsset);
    if (asset?.id) return prepareAsset(asset);
  }, [resourceAsset, asset]);

  const finalPlayerWidth = playerWidth || PLAYER_WIDTHS[preparedResource?.fileType];

  if (!preparedResource) return null;
  return (
    <Stack fullWidth justifyContent="center">
      <AssetPlayerWrapperCCreator
        asset={preparedResource}
        useAudioCard={preparedResource?.fileType === 'audio'}
        width={finalPlayerWidth}
      />
    </Stack>
  );
}

StemResource.propTypes = {
  assetId: PropTypes.string,
  asset: PropTypes.any,
  styles: PropTypes.any,
  playerWidth: PropTypes.number,
};
