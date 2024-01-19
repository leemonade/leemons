import React from 'react';
import { getAssetsByIdsRequest } from '@leebrary/request';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useApi } from '@common';
import { LibraryItem } from '@leebrary/components';
import { Box, Divider } from '@bubbles-ui/components';
import { RESOURCES_DEFAULT_PROPS, RESOURCES_PROP_TYPES } from './Resources.constants';
import { resourceStyles } from './Resources.styles';

async function getResources(ids) {
  const response = await getAssetsByIdsRequest(ids, { showPublic: true, indexable: 0 });

  return response.assets.map((asset) => prepareAsset(asset));
}

const Resources = ({ assignation }) => {
  const { classes } = resourceStyles();
  const [resources] = useApi(getResources, assignation?.instance?.assignable?.resources);

  return (
    <Box>
      {resources &&
        resources?.map((resource, index, array) => (
          <Box
            onClick={() => window.open(resource.url || resource.cover, '_blank', 'noopener')}
            key={resource?.id}
            sx={{ cursor: 'pointer' }}
          >
            <Divider />
            <Box className={classes.root}>
              <LibraryItem asset={resource} />
            </Box>
            {index === array.length - 1 && <Divider />}
          </Box>
        ))}
    </Box>
  );
};

Resources.propTypes = RESOURCES_PROP_TYPES;
Resources.defaultProps = RESOURCES_DEFAULT_PROPS;
Resources.displayName = 'Resources';

export default Resources;
export { Resources };
