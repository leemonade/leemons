import React, { useState, useCallback, useEffect, createContext, useContext, useRef } from 'react';
import { Tree as ReactTree } from '@leemonade/react-dnd-treeview';
import _ from 'lodash';
import { node } from 'prop-types';
import NodeRenderer from './NodeRenderer';
import { NodePlaceholderRenderer } from './NodePlaceholderRenderer';
import { NodeDragPreview } from './NodeDragPreview';

const TreeContext = createContext();

export const useTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  return { treeData, setTreeData, selectedNode, setSelectedNode };
};

const Tree = ({
  treeData,
  setTreeData,
  selectedNode,
  setSelectedNode,
  onSelect,
  onAdd,
  onDelete,
  ...otherProps
}) => {
  const [data, setData] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const state = {
    selectedNode: selectedNode || currentNode,
    setSelectedNode: setSelectedNode || setCurrentNode,
    treeData: treeData || data,
    setTreeData: setTreeData || setData,
    onDelete,
    onAdd,
    onSelect,
  };
  return (
    <TreeContext.Provider value={state}>
      <TreeView {...otherProps} />
    </TreeContext.Provider>
  );
};

const TreeView = ({
  allowDropOutside,
  allowMultipleOpen,
  allowDragParents,
  initialSelected,
  initialOpen,
  rootId,
  ...otherProps
}) => {
  const [initialized, setInitialized] = useState(false);
  const currentNode = useRef(null);
  const {
    treeData,
    setTreeData,
    selectedNode,
    setSelectedNode,
    onAdd,
    onDelete,
    onSelect,
  } = useContext(TreeContext);

  const treeRef = useRef(null);

  const closeAllNodes = useCallback(() => {
    treeRef.current.closeAll();
  }, [treeRef]);

  const openBranch = useCallback(
    (nodeId, inclusive, replace) => {
      treeRef.current.openBranch(
        nodeId,
        inclusive, // this open the pass node as well
        replace // this replace the entire tree open Ids
      );
    },
    [treeRef]
  );

  useEffect(() => {
    // Open the branch when a node is selected (through code)
    if (selectedNode?.id) {
      openBranch(selectedNode.id, selectedNode.inclusive || false, selectedNode.replace || false);
    } else if (selectedNode?.fold) {
      // Fold into the specified branch when deselect (through code)
      openBranch(selectedNode.fold, selectedNode.inclusive || false, selectedNode.replace || true);
    } else {
      openBranch(selectedNode, false, false);
    }
  }, [selectedNode]);

  // ------------------------------------------------------------------
  // HANDLERS
  const handleDrop = (newTree) => setTreeData(newTree);
  const handleCanDrop = (tree, { dragSource, dropTargetId, dropTarget }) => {
    if (allowDropOutside || dragSource?.parent === dropTargetId) {
      return true;
    }
    return false;
  };
  const handleCanDrag = (node, ...rest) => node.draggable !== false;
  const handleOnToggle = (node, isOpen, onToggle) => {
    if (!isOpen) {
      openBranch(node.id, true, !allowMultipleOpen);
    } else if (isOpen && node.parent === 0 && !allowMultipleOpen) {
      closeAllNodes();
    } else {
      onToggle(node.id);
    }
    /*
    else if (currentNode.current && currentNode.current.id === node.id) {
      onToggle(node.id);
    } else if (allowMultipleOpen) {
      onToggle(node.id);
    }
    */

    currentNode.current = node;
  };

  const handleSelect = (node, onSelect, e, onToggle) => {
    if (onSelect) {
      onSelect(node, onToggle);
    } else {
      onToggle();
    }
    return false;
  };

  return (
    <div className="relative flex">
      <ReactTree
        ref={treeRef}
        tree={treeData}
        rootId={rootId || 0}
        render={(
          node,
          {
            depth,
            isOpen,
            hasChild,
            onToggle,
            // onSelect,
            lowerSiblingsCount,
            hasOpenSiblings,
            siblingIndex,
            isSelected,
          }
        ) => {
          let Renderer = NodeRenderer;
          if (node.render) {
            Renderer = node.render;
          }
          return (
            <Renderer
              {...otherProps}
              node={node}
              treeData={treeData}
              setTreeData={setTreeData}
              depth={depth}
              isOpen={isOpen}
              hasChild={hasChild}
              lowerSiblingsCount={lowerSiblingsCount}
              hasOpenSiblings={hasOpenSiblings}
              siblingIndex={siblingIndex}
              onToggle={(e) => handleOnToggle(node, isOpen, onToggle, e)}
              isSelected={isSelected || selectedNode === node.id || selectedNode?.id === node.id}
              onSelect={(e, onToggle) => handleSelect(node, onSelect, e, onToggle)}
              allowDropOutside={allowDropOutside}
              allowMultipleOpen={allowMultipleOpen}
              allowDragParents={allowDragParents}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          );
        }}
        dragPreviewRender={(monitorProps) => {
          let DragPreview = NodeDragPreview;
          if (monitorProps.item.dragPreview) {
            DragPreview = monitorProps.item.dragPreview;
          }
          return <DragPreview monitorProps={monitorProps} />;
        }}
        classes={{
          root: 'tree',
          draggingSource: 'tree_draggingSource',
          placeholder: 'tree_placeholderContainer',
          dropTarget: 'tree_dropTarget',
        }}
        sort={false}
        insertDroppableFirst={false}
        canDrop={handleCanDrop}
        canDrag={handleCanDrag}
        onDrop={handleDrop}
        initialOpen={initialOpen}
        initialSelected={initialSelected}
        dropTargetOffset={20}
        placeholderRender={(node, { depth }) => {
          let PlaceholderRenderer = NodePlaceholderRenderer;
          if (node.placeholderRender) {
            PlaceholderRenderer = node.placeholderRender;
          }
          <PlaceholderRenderer node={node} depth={depth} />;
        }}
      />
    </div>
  );
};

export default Tree;
