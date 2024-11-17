import React from 'react';
import { Box } from '@mantine/core';
import { LoveItIcon } from '@bubbles-ui/icons/outline';
import { FavButtonStyles } from './FavButton.styles';
import { FAV_BUTTON_DEFAULT_PROPS, FAV_BUTTON_PROP_TYPES } from './FavButton.constants';

const FavButton = ({ isActive }) => {
  const { classes } = FavButtonStyles({ active: isActive }, { name: 'FavButton' });

  return (
    <Box as="button" className={classes.root}>
      <LoveItIcon width={24} height={24} className={classes.loveIcon} />
    </Box>
  );
};

FavButton.defaultProps = FAV_BUTTON_DEFAULT_PROPS;
FavButton.propTypes = FAV_BUTTON_PROP_TYPES;
FavButton.displayName = 'FavButton';

export default FavButton;
export { FavButton };
