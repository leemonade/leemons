import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { FavButtonStyles } from './FavButton.styles';
import { FAV_BUTTON_DEFAULT_PROPS, FAV_BUTTON_PROP_TYPES } from './FavButton.constants';
import { LoveItIcon } from '@bubbles-ui/icons/outline';

const FavButton = ({ isActive, isParentHovered }) => {
  const [active, setActive] = useState(isActive);
  const { classes } = FavButtonStyles({ isActive, isParentHovered }, { name: 'FavButton' });

  const handleIsActive = () => {
    setActive(!active);
  };

  return (
    <Box className={classes.root} onClick={() => handleIsActive()}>
      <LoveItIcon width={15} height={15} className={classes.loveIcon} />
    </Box>
  );
};

FavButton.defaultProps = FAV_BUTTON_DEFAULT_PROPS;
FavButton.propTypes = FAV_BUTTON_PROP_TYPES;

export { FavButton };
