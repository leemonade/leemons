import { useMemo } from 'react';

import { Box } from '@bubbles-ui/components';
import { AssetPlayerWrapperCCreator } from '@leebrary/components/LibraryTool/AssetPlayerWrapperCCreator';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAsset from '@leebrary/request/hooks/queries/useAsset';
import PropTypes from 'prop-types';

export default function StemResource({ assetId, ...props }) {
  const { data: resourceAsset } = useAsset({
    id: assetId,
    showPublic: true,
    enabled: !!assetId,
  });

  const preparedResource = useMemo(() => {
    return resourceAsset ? prepareAsset(resourceAsset) : null;
  }, [resourceAsset]);

  if (!resourceAsset) return null;
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
  assetId: PropTypes.any,
  styles: PropTypes.any,
};
