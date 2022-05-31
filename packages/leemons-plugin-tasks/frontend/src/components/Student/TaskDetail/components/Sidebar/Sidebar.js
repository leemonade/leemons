import React from 'react';
import { Box, ContextContainer } from '@bubbles-ui/components';
import { getAssetsByIdsRequest } from '@leebrary/request';
import { useApi } from '@common';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { sidebarStyles } from './Sidebar.style';

async function getResources(ids) {
  console.log('ids', ids);
  const response = await getAssetsByIdsRequest(ids, { showPublic: true });

  return response.assets.map((asset) => prepareAsset(asset));
}

export default function Sidebar({ assignation, show = true, labels }) {
  const { classes, cx } = sidebarStyles();
  const [resources] = useApi(getResources, assignation?.instance?.assignable?.resources);
  console.log('resources', resources);

  const showTeam = false;
  const showResources = resources?.length;
  if (show && (showTeam || showResources)) {
    return (
      <Box className={cx(classes.sidebar, classes.sidebarColor)}>
        {showResources && (
          <ContextContainer title={labels?.resources}>
            {resources?.map((resource) => (
              <Box key={resource.id}>
                icon of type {resource?.file?.extension}
                name: {resource?.name}
                url: {resource?.url}
                extension: {resource?.file?.extension}
              </Box>
            ))}
          </ContextContainer>
        )}
        {showTeam && <ContextContainer title={labels?.team}></ContextContainer>}
      </Box>
    );
  }
  return (
    // EN: The sidebar space should be kept empty
    // ES: El espacio del sidebar debe estar vacío
    <Box className={classes.sidebar} />
  );
}
