import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { usePickerCategories } from '@leebrary/components/AssetPickerDrawer/hooks/usePickerCategories';
import { keyBy } from 'lodash';
import { LibraryCardEmbed } from '@leebrary/components/LibraryCardEmbed';

// useLocalizations

export const useItemStyles = createStyles((theme, { color }) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      width: '100%',

      display: 'flex',
      alignItems: 'center',
      gap: globalTheme.spacing.padding.lg,

      cursor: 'pointer',
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

  return (
    <Box className={classes.root} onClick={() => onSelect?.(asset)}>
      <LibraryCardEmbed asset={asset} hasActionButton={false} fullWidth={true} />
    </Box>
  );
}

Item.propTypes = {
  asset: PropTypes.object,
  onSelect: PropTypes.func,
};
