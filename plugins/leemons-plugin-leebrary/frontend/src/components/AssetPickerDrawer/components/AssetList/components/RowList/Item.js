import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  ImageLoader,
  Text,
  TextClamp,
  createStyles,
  getBoxShadowFromToken,
} from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { usePickerCategories } from '@leebrary/components/AssetPickerDrawer/hooks/usePickerCategories';
import { keyBy } from 'lodash';

// useLocalizations

export const useItemStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;
  const { cardEvaluation } = theme.other;
  const getCardShadow = getBoxShadowFromToken(cardEvaluation.shadow.hover[0]);
  return {
    root: {
      width: '100%',
      padding: globalTheme.spacing.padding.xsm,
      borderWidth: globalTheme.border.width.sm,
      borderStyle: 'solid',
      borderColor: globalTheme.border.color.line.muted,
      borderRadius: globalTheme.border.radius.md,
      background: globalTheme.background.color.surface.default,

      display: 'flex',
      alignItems: 'center',
      gap: globalTheme.spacing.padding.md,

      cursor: 'pointer',
      '&:hover': {
        boxShadow: getCardShadow.boxShadow,
      },
    },
    image: { width: 50, height: 50, position: 'relative' },
    thumbnail: {
      background: '#D9D9D9',
      width: '100%',
      height: '100%',
      minWidth: 50,
      borderRadius: globalTheme.border.radius.md,
      overflow: 'hidden',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      background: color,
      position: 'absolute',
      left: 6,
      bottom: 6,
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
      ...globalTheme.content.typo.body['md--bold'],
      color: globalTheme.content.color.text.default,
    },
  };
});

export function Item({ asset, onSelect }) {
  const { classes } = useItemStyles({ color: asset.color }, { name: 'AssetList-Item' });

  const categories = usePickerCategories();
  const categoriesByKey = useMemo(() => keyBy(categories, 'id'), [categories]);

  const preparedAsset = prepareAsset(asset);

  return (
    <Box className={classes.root} onClick={() => onSelect?.(asset)}>
      <Box className={classes.image}>
        <Box className={classes.thumbnail}>
          {!!preparedAsset?.cover && (
            <ImageLoader bordered radius={4} src={preparedAsset.cover} width={50} height={50} />
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
        <TextClamp maxLines={1} lines={1}>
          <Text className={classes.name}>{asset.name}</Text>
        </TextClamp>
        {asset?.description ? (
          <TextClamp maxLines={1} lines={1}>
            <Text>{asset.description}</Text>
          </TextClamp>
        ) : null}
      </Box>
    </Box>
  );
}

Item.propTypes = {
  asset: PropTypes.object,
  onSelect: PropTypes.func,
};
