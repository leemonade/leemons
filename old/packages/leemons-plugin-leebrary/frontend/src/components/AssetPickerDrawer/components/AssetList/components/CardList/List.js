import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React from 'react';
import { Item } from './Item';

export const useListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      zIndex: 0,
      gap: globalTheme.spacing.gap.lg,
    },
  };
});

export default function CardList({ items, onSelect }) {
  const { classes } = useListStyles();

  return (
    <Box className={classes.list}>
      {items.map((item) => (
        <Item key={item.id} asset={item} onSelect={onSelect} />
      ))}
    </Box>
  );
}

CardList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onSelect: PropTypes.func,
};
