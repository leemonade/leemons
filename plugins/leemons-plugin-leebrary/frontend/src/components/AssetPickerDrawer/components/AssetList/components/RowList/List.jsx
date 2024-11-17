import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React from 'react';
import { Item } from './Item';

export const useListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: globalTheme.spacing.padding.xlg,
      gap: globalTheme.spacing.padding.md,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
    },
  };
});

export function RowList({ items, onSelect }) {
  const { classes } = useListStyles({}, { name: 'AssetList-List' });

  return (
    <Box className={classes.root}>
      <Box className={classes.list}>
        {items.map((item, index) => (
          <Item key={`${item.id}-${index}`} asset={item} onSelect={onSelect} />
        ))}
      </Box>
    </Box>
  );
}

RowList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func,
};
