import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Stack, Text, createStyles } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { prepareAsset } from '../helpers/prepareAsset';

const CardWrapperStyles = createStyles((theme, {}) => ({
  root: {
    cursor: 'pointer',
  },
}));

const CardWrapper = ({
  key,
  item,
  headers,
  selected,
  className,
  variant = 'media',
  onDelete = () => {},
  onClick = () => {},
  ...props
}) => {
  const asset = prepareAsset(item.original);
  const menuItems = [];
  const { classes } = CardWrapperStyles({});
  return (
    <Box key={key} {...props} onClick={() => onClick(asset)}>
      <LibraryCard asset={asset} menuItems={menuItems} variant={variant} className={classes.root} />
    </Box>
  );
};

CardWrapper.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  variant: PropTypes.string,
};

export { CardWrapper };
export default CardWrapper;
