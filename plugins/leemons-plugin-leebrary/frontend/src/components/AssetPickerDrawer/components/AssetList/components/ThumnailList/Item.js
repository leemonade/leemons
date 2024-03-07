import { Box, ImageLoader, createStyles, getBoxShadowFromToken } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import PropTypes from 'prop-types';
import React from 'react';

const ITEM_WIDTH = 208;
const ITEM_HEIGHT = 170;

export const useItemStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;
  const cardTheme = theme.other.cardLibrary;
  const cardShadow = getBoxShadowFromToken(cardTheme.shadow.hover);

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: globalTheme.spacing.padding.lg,
      objectFit: 'cover',
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      cursor: 'pointer',
      borderRadius: cardTheme.border.radius.sm,
      overflow: 'hidden',
      border: `${cardTheme.border.width.sm} solid ${cardTheme.border.color.subtle}`,
      '&:hover': {
        boxShadow: cardShadow.boxShadow,
      },
    },
    image: { width: ITEM_WIDTH, height: ITEM_HEIGHT, position: 'relative' },
    // TODO: Add token color
    thumbnail: {
      background: cardTheme.background.color.default,
      width: '100%',
      height: '100%',
      minWidth: ITEM_WIDTH,
      minHeight: ITEM_HEIGHT,
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
            <ImageLoader src={preparedAsset.cover} width={ITEM_WIDTH} height={ITEM_HEIGHT} />
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
