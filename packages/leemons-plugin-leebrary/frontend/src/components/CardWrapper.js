import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Stack, Text } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import prepareAsset from '../helpers/prepareAsset';

const CardWrapper = ({ key, item, headers, selected, className, ...props }) => {
  const asset = prepareAsset(item.original);

  return (
    <Box key={key} {...props}>
      <LibraryCard asset={asset} variant="media" />
    </Box>
  );
};

CardWrapper.propTypes = {
  key: PropTypes.string,
  item: PropTypes.any,
  headers: PropTypes.any,
  selected: PropTypes.bool,
  className: PropTypes.string,
};

export { CardWrapper };
export default CardWrapper;
