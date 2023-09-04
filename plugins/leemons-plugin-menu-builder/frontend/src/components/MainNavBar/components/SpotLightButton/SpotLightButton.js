import React from 'react';
import { SearchIcon } from '@bubbles-ui/icons/outline';
import { Box, Text } from '@bubbles-ui/components';
import { SpotLightButtonStyles } from './SpotLightButton.styles';
import { navTitleVariants } from '../../MainNavBar.constants';
import { motion } from "framer-motion"

export const SpotLightButton = ({ onClick, isCollapsed }) => {
  const { classes } = SpotLightButtonStyles();
  return (
    <Box>
      <Box variant="link" role="button" onClick={() => onClick()} className={classes.buttonWrapper}>
        <SearchIcon className={classes.icon} />
        <motion.div
          initial={{ opacity: '0' }}
          animate={isCollapsed ? "closed" : "open"}
          variants={navTitleVariants}
        >
          <Text className={classes.text}>Buscar en el menú</Text>
        </motion.div>
      </Box>
    </Box>
  );
};
