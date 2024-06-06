import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { Tree, MultiBackend, getBackendOptions } from '@minoru/react-dnd-treeview';

import { Box } from '@bubbles-ui/components';

import { NodeRenderer } from './NodeRenderer/NodeRenderer';
import { TreeHeader } from './TreeHeader/TreeHeader';

const TreeBox = ({ treeStructures, selectedTreeNode, handleNodeClick }) => {
  const [openedNodes, setOpenedNodes] = useState(treeStructures.map(() => ({})));
  const treeRefs = useRef(treeStructures.map(() => React.createRef()));

  useEffect(() => {
    setOpenedNodes(treeStructures.map(() => ({})));
  }, [treeStructures]);

  useEffect(() => {
    treeRefs.current = treeStructures.map(() => React.createRef());
  }, [treeStructures]);

  const handleNodeToggle = (treeIndex, nodeId, nodeType, callback) => {
    const currentOpenedNode = openedNodes[treeIndex]?.[nodeType];
    if (currentOpenedNode && currentOpenedNode !== nodeId) {
      setTimeout(() => callback(currentOpenedNode), 0);
    }
    setOpenedNodes((prevOpenedNodes) =>
      prevOpenedNodes.map((openedNode, index) => {
        if (index === treeIndex) {
          const updatedNode = { ...openedNode };
          if (openedNode[nodeType] === nodeId) {
            delete updatedNode[nodeType];
          } else {
            updatedNode[nodeType] = nodeId;
          }
          return updatedNode;
        }
        return openedNode;
      })
    );
  };

  return (
    <Box style={{ width: 192, position: 'fixed' }}>
      {treeStructures.map((treeStructure, index) => (
        <Box
          key={`${index}-${treeStructure?.header?.name}`}
          style={index > 0 ? { marginTop: 24 } : {}}
        >
          {treeStructure.header && <TreeHeader name={treeStructure.header.name} />}
          <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
              ref={treeRefs.current[index]}
              enableAnimateExpand={true}
              tree={treeStructure.treeData}
              rootId={0}
              canDrag={() => false}
              canDrop={() => false}
              render={(node, { depth, isOpen }) => (
                <NodeRenderer
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={() => {
                    handleNodeToggle(
                      index,
                      node.id,
                      node.type,
                      treeRefs.current[index].current.close
                    );
                    setTimeout(
                      () =>
                        isOpen
                          ? treeRefs.current[index].current.close(node.id)
                          : treeRefs.current[index].current.open(node.id),
                      0
                    );
                  }}
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
