import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, ImageLoader, createStyles } from '@bubbles-ui/components';
import { prepareAsset } from '../helpers/prepareAsset';

const AssetThumbnailStyles = createStyles((theme, { selected }) => ({
  root: {
    cursor: 'pointer',
    borderStyle: 'solid',
    borderColor: selected ? theme.colors.interactive01d : theme.colors.ui02,
    borderWidth: 1,
    boxShadow: selected && theme.shadows.shadow03,
    width: '100%',
    '&:hover': {
      boxShadow: theme.shadows.shadow03,
    },
  },
}));

const AssetThumbnail = ({ key, item, selected, headers, className, ...props }) => {
  const asset = prepareAsset(item.original);
  const { classes } = AssetThumbnailStyles({ selected });

  return (
    <Box key={key} {...props}>
      <Box className={classes.root}>
        <ImageLoader src={asset.cover} height={170} />
      </Box>
    </Box>
  );
};

AssetThumbnail.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export { AssetThumbnail };
export default AssetThumbnail;
