import React from 'react';
import { ChevDownIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { Box, Text, TextClamp } from '@bubbles-ui/components';
import { NODE_RENDERER_PROP_TYPES, NODE_RENDERER_DEFAULT_PROPS } from './NodeRenderer.constants';
import { NodeRendererStyles } from './NodeRenderer.styles';

const NodeRenderer = ({ node, depth, isOpen, onToggle, isActive, handleNodeClick }) => {
  const { classes } = NodeRendererStyles({ depth, isActive });
  const handleClick = (nodeParam) => {
    if (handleNodeClick) {
      handleNodeClick(nodeParam);
    }
    onToggle(nodeParam);
  };
  return (
    <Box className={classes.node} onClick={() => handleClick(node)}>
      {node.droppable && (
        <Box className={classes.icon}>{isOpen ? <ChevDownIcon /> : <ChevRightIcon />}</Box>
      )}
      <TextClamp lines={1} withTooltip>
        <Text className={classes.nodeText}>{node.text}</Text>
      </TextClamp>
    </Box>
  );
};

NodeRenderer.propTypes = NODE_RENDERER_PROP_TYPES;
NodeRenderer.defaultProps = NODE_RENDERER_DEFAULT_PROPS;

export { NodeRenderer };
