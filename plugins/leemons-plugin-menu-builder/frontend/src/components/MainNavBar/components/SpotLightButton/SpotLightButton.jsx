import React from 'react';
import { SearchIcon } from '@bubbles-ui/icons/outline';
import { Box, Text } from '@bubbles-ui/components';
import { motion } from 'framer-motion';
import { SpotLightButtonStyles } from './SpotLightButton.styles';
import { navTitleVariants } from '../../MainNavBar.constants';
import {
  SPOTLIGHT_BUTTON_DEFAULT_PROPS,
  SPOTLIGHT_BUTTON_PROP_TYPES,
} from './SpotLightButton.constants';

const SpotLightButton = ({ onClick, isCollapsed, spotlightLabel }) => {
  const { classes } = SpotLightButtonStyles();
  return (
    <Box>
      <Box variant="link" role="button" onClick={() => onClick()} className={classes.buttonWrapper}>
        <SearchIcon className={classes.icon} />
        <motion.div
          initial={{ opacity: '0' }}
          animate={isCollapsed ? 'closed' : 'open'}
          variants={navTitleVariants}
        >
          <Text className={classes.text}>{spotlightLabel}</Text>
        </motion.div>
      </Box>
    </Box>
  );
};

SpotLightButton.displayName = 'SpotLightButton';
SpotLightButton.defaultProps = SPOTLIGHT_BUTTON_DEFAULT_PROPS;
SpotLightButton.propTypes = SPOTLIGHT_BUTTON_PROP_TYPES;

export default SpotLightButton;
export { SpotLightButton };
