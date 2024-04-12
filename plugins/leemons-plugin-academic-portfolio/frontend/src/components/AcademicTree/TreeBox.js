import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { Tree, MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview';

import { Box } from '@bubbles-ui/components';

import { NodeRenderer } from './NodeRenderer/NodeRenderer';
import { TreeHeader } from './TreeHeader/TreeHeader';

const TreeBox = ({ viewRef, treeStructures, selectedTreeNode, handleNodeClick }) => {
  const [treeBoxStickyStyles, setTreeBoxStickyStyles] = useState({});
  useEffect(() => {
    let animationFrameId;

    const updateFooterStyles = () => {
      const clientRect = viewRef.current?.getBoundingClientRect();
      setTreeBoxStickyStyles({ left: Math.round(clientRect?.left) - 192 });

      animationFrameId = requestAnimationFrame(updateFooterStyles);
    };

    animationFrameId = requestAnimationFrame(updateFooterStyles);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewRef?.current]);

  return (
    <Box style={{ width: 192, position: 'fixed', ...treeBoxStickyStyles }}>
      {treeStructures.map((treeStructure, index) => (
        <Box key={`${index}-${treeStructure?.header?.name}`}>
          {treeStructure.header && <TreeHeader name={treeStructure.header.name} />}
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
              enableAnimateExpand={true}
              tree={treeStructure.treeData}
              rootId={0}
              canDrag={() => false}
              canDrop={() => false}
              render={(node, { depth, isOpen, onToggle }) => (
                <NodeRenderer
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={onToggle}
                  isActive={selectedTreeNode?.nodeId === node.nodeId}
                  handleNodeClick={handleNodeClick}
                />
              )}
            />
          </DndProvider>
        </Box>
      ))}
    </Box>
  );
};

TreeBox.propTypes = {
  viewRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  treeStructures: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.shape({
        name: PropTypes.string,
      }),
      treeData: PropTypes.array,
    })
  ),
  selectedTreeNode: PropTypes.shape({
    nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleNodeClick: PropTypes.func,
};

export default TreeBox;
