import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text, TextClamp, createStyles } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { usePickerCategories } from '@leebrary/components/AssetPickerDrawer/hooks/usePickerCategories';
import { keyBy } from 'lodash';

// useLocalizations

export const useItemStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      width: '100%',
      padding: globalTheme.spacing.padding.xsm,
      borderWidth: globalTheme.border.width.sm,
      borderStyle: 'solid',
      borderColor: globalTheme.border.color.line.default,

      display: 'flex',
      alignItems: 'center',
      gap: globalTheme.spacing.padding.lg,

      cursor: 'pointer',
    },
    image: { width: 78, height: 78, position: 'relative' },
    // TODO: Add token color
    thumbnail: { background: '#D9D9D9', width: '100%', height: '100%', minWidth: 78 },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      background: color,
      position: 'absolute',
      left: 8,
      bottom: 8,
      borderRadius: globalTheme.border.radius.md,
    },
    iconImage: {
      filter: 'brightness(0) invert(1)',
      color: theme.white,
      position: 'relative',
      width: 16,
      height: 20,
    },
    body: {},
    name: {
      ...globalTheme.content.typo.body.lg,
      color: globalTheme.content.color.text.primary,
    },
  };
});

export function Item({ asset, onSelect }) {
  const { classes } = useItemStyles({ color: asset.color });

  const categories = usePickerCategories();
  const categoriesByKey = useMemo(() => keyBy(categories, 'id'), [categories]);

  const preparedAsset = prepareAsset(asset);

  return (
    <Box className={classes.root} onClick={() => onSelect?.(asset)}>
      <Box className={classes.image}>
        <Box className={classes.thumbnail}>
          {!!preparedAsset?.cover && (
            <ImageLoader src={preparedAsset.cover} width={78} height={78} />
          )}
        </Box>
        <Box className={classes.icon}>
          <Box className={classes.iconImage}>
            <ImageLoader
              src={categoriesByKey?.[preparedAsset.category]?.icon}
              width={16}
              height={20}
            />
          </Box>
        </Box>
      </Box>
      <Box className={classes.body}>
        <TextClamp maxLines={2} lines={2}>
          <Text className={classes.name}>{asset.name}</Text>
        </TextClamp>
      </Box>
    </Box>
  );
}

Item.propTypes = {
  asset: PropTypes.object,
  onSelect: PropTypes.func,
};
