import { Box, Text } from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import { useApi } from '@common';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { getAssetsByIdsRequest } from '@leebrary/request';
import React from 'react';
import { sidebarStyles } from './Sidebar.style';

async function getResources(ids) {
  const response = await getAssetsByIdsRequest(ids, { showPublic: true, indexable: 0 });

  return response.assets.map((asset) => prepareAsset(asset));
}

export default function Sidebar({ assignation, show = true, labels }) {
  const { classes, cx } = sidebarStyles();
  const [resources] = useApi(getResources, assignation?.instance?.assignable?.resources);

  const showTeam = false;
  const showResources = resources?.length;
  if (show && (showTeam || showResources)) {
    return (
      <Box className={cx(classes.sidebar, classes.sidebarColor)}>
        {showResources && (
          <Box className={classes?.sidebarSection}>
            <Text color="soft">{labels?.resources}</Text>
            <Box className={classes.resourceContainer}>
              {resources?.map((resource) => (
                <Box
                  onClick={() => window.open(resource.url || resource.cover, '_blank', 'noopener')}
                  key={resource?.id}
                  sx={{ cursor: 'pointer' }}
                >
                  <LibraryItem asset={resource} />
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {showTeam && (
          <Box>
            <Text color="soft">{labels?.team}</Text>
          </Box>
        )}
      </Box>
    );
  }
  return (
    // EN: The sidebar space should be kept empty
    // ES: El espacio del sidebar debe estar vacío
    <Box className={classes.sidebar} />
  );
}
