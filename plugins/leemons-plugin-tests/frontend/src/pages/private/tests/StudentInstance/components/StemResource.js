import { useMemo } from 'react';

import { Box } from '@bubbles-ui/components';
import { AssetPlayerWrapperCCreator } from '@leebrary/components/LibraryTool/AssetPlayerWrapperCCreator';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAsset from '@leebrary/request/hooks/queries/useAsset';
import PropTypes from 'prop-types';

export default function StemResource({ asset, ...props }) {
  const { data: resourceAsset } = useAsset({
    id: asset,
    showPublic: true,
    enabled: !!asset && typeof asset === 'string',
  });

  const preparedResource = useMemo(() => {
    if (typeof asset === 'string' && resourceAsset) return prepareAsset(resourceAsset);
    if (asset?.id) return prepareAsset(asset);
  }, [resourceAsset, asset]);

  if (!preparedResource) return null;
  return (
    <Box className={props.styles.questionImageContainer}>
      <AssetPlayerWrapperCCreator
        asset={preparedResource}
        useAudioCard={preparedResource?.fileType === 'audio'}
      />
    </Box>
  );
}

StemResource.propTypes = {
  assetId: PropTypes.string,
  asset: PropTypes.any,
  styles: PropTypes.any,
};
