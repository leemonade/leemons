import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { LoveItIcon } from '@bubbles-ui/icons/outline';
import { FavButtonStyles } from './FavButton.styles';
import { FAV_BUTTON_DEFAULT_PROPS, FAV_BUTTON_PROP_TYPES } from './FavButton.constants';

const FavButton = ({ isActive }) => {
  const [active, setActive] = useState(isActive);
  const { classes } = FavButtonStyles({ isActive }, { name: 'FavButton' });

  const handleIsActive = () => {
    setActive(!active);
  };

  return (
    <Box className={classes.root} onClick={() => handleIsActive()}>
      <LoveItIcon width={24} height={24} className={classes.loveIcon} />
    </Box>
  );
};

FavButton.defaultProps = FAV_BUTTON_DEFAULT_PROPS;
FavButton.propTypes = FAV_BUTTON_PROP_TYPES;

export default FavButton;
export { FavButton };
