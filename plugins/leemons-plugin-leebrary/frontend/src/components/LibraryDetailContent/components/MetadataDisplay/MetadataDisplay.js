import React from 'react';
import { Box, Text } from '@bubbles-ui/components';
import {
  METADATA_DISPLAY_PROP_TYPES,
  METADATA_DISPLAY_DEFAULT_PROPS,
} from './MetadataDisplay.constants';
import { MetadataDisplayStyles } from './MetadataDisplay.styles';

const MetadataDisplay = ({ metadata }) => {
  const { classes } = MetadataDisplayStyles({}, { name: 'MetadataDisplay' });
  return <Box className={classes.root}>metadataDisplay</Box>;
};

MetadataDisplay.displayName = 'MetadataDisplay';
MetadataDisplay.propTypes = METADATA_DISPLAY_PROP_TYPES;
MetadataDisplay.defaultProps = METADATA_DISPLAY_DEFAULT_PROPS;

export default MetadataDisplay;
export { MetadataDisplay };
