import { Box, ImageLoader, createStyles } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import PropTypes from 'prop-types';
import React from 'react';

// useLocalizations

export const useItemStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      // padding: globalTheme.spacing.padding.xsm,
      // borderWidth: globalTheme.border.width.sm,
      // borderStyle: 'solid',
      // borderColor: globalTheme.border.color.line.default,

      display: 'flex',
      alignItems: 'center',
      gap: globalTheme.spacing.padding.lg,
      objectFit: 'cover',
      width: 201,
      height: 170,
      cursor: 'pointer',
    },
    image: { width: 201, height: 170, position: 'relative' },
    // TODO: Add token color
    thumbnail: {
      background: '#D9D9D9',
      width: '100%',
      height: '100%',
      minWidth: 201,
      minHeight: 170,
    },
  };
});

export function Item({ asset, onSelect }) {
  const { classes } = useItemStyles({ color: asset.color });
  const preparedAsset = prepareAsset(asset);

  return (
    <Box className={classes.root} onClick={() => onSelect?.(asset)}>
      <Box className={classes.image}>
        <Box className={classes.thumbnail}>
          {!!preparedAsset?.cover && (
            <ImageLoader src={preparedAsset.cover} width={201} height={170} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

Item.propTypes = {
  asset: PropTypes.object,
  onSelect: PropTypes.func,
};
