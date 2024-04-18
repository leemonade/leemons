import React from 'react';
import { Text, Box, Divider, Stack } from '@bubbles-ui/components';
import { TreeHeaderStyles } from './TreeHeader.styles';
import { TREE_HEADER_PROP_TYPES, TREE_HEADER_DEFAULT_PROPS } from './TreeHeader.constants';

const TreeHeader = ({ name }) => {
  const { classes } = TreeHeaderStyles();
  return (
    <Box className={classes.header}>
      <Box>
        <Text className={classes.headerText}>{name}</Text>
      </Box>
      <Box className={classes.divider}>
        <Divider />
      </Box>
    </Box>
  );
};

TreeHeader.propTypes = TREE_HEADER_PROP_TYPES;
TreeHeader.defaultProps = TREE_HEADER_DEFAULT_PROPS;

export { TreeHeader };
