import React from 'react';
import { Text, Box, Divider, TextClamp } from '@bubbles-ui/components';
import { TreeHeaderStyles } from './TreeHeader.styles';
import { TREE_HEADER_PROP_TYPES, TREE_HEADER_DEFAULT_PROPS } from './TreeHeader.constants';

const TreeHeader = ({ name }) => {
  const { classes } = TreeHeaderStyles();
  return (
    <Box className={classes.header}>
      <TextClamp lines={2} withTooltip>
        <Text className={classes.headerText}>{name}</Text>
      </TextClamp>
      <Divider />
    </Box>
  );
};

TreeHeader.propTypes = TREE_HEADER_PROP_TYPES;
TreeHeader.defaultProps = TREE_HEADER_DEFAULT_PROPS;

export { TreeHeader };
