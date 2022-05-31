import React from 'react';
import { Box, ContextContainer, FileIcon, Anchor, Text } from '@bubbles-ui/components';
import { getAssetsByIdsRequest } from '@leebrary/request';
import { useApi } from '@common';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { sidebarStyles } from './Sidebar.style';

async function getResources(ids) {
  const response = await getAssetsByIdsRequest(ids, { showPublic: true });

  return response.assets.map((asset) => prepareAsset(asset));
}

function ResourceRenderer({ resource, classes }) {
  return (
    <Box className={classes?.resource}>
      <Box>
        <FileIcon
          size={16}
          fileExtension={resource?.file?.extension}
          fileType={null}
          color="#212B3D"
        />
      </Box>
      <Box className={classes?.resourceContent}>
        <Anchor href={resource.url} target="_blank">
          {resource.name}
        </Anchor>
        <Text>{resource?.file?.extension}</Text>
      </Box>
    </Box>
  );
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
                <ResourceRenderer resource={resource} key={resource?.id} classes={classes} />
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
