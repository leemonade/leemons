import React, { useState, useCallback, useEffect, createContext, useContext, useRef } from 'react';
import { Tree } from '@minoru/react-dnd-treeview';
import { NodeRenderer } from './NodeRenderer';
import { NodePlaceholderRenderer } from './NodePlaceholderRenderer';
import { NodeDragPreview } from './NodeDragPreview';
import _ from 'lodash';

const TreeContext = createContext();

export const useTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  return { treeData, setTreeData, selectedNode, setSelectedNode };
};

const TreeContainer = ({ treeData, setTreeData, selectedNode, setSelectedNode, ...otherProps }) => {
  const [data, setData] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const state = {
    selectedNode: selectedNode || currentNode,
    setSelectedNode: setSelectedNode || setCurrentNode,
    treeData: treeData || data,
    setTreeData: setTreeData || setData,
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
  selectedNodeId,
  initialOpen,
  ...otherProps
}) => {
  const [initialized, setInitialized] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const currentNode = useRef(null);
  const { treeData, setTreeData, selectedNode, setSelectedNode } = useContext(TreeContext);
  const treeRef = useRef(null);

  const openBranch = useCallback(
    (nodeId, includeNode) => {
      let newData = _.cloneDeep(treeData);
      let node = _.find(newData, { id: nodeId });
      if (includeNode) {
        treeRef.current.open(node.id);
        newData.splice(_.indexOf(newData, node), 1, {
          ...node,
          data: { ...node.data, open: true },
        });
      }
      // Open all parents
      if (node && node.parent) {
        while (node.parent !== 0) {
          node = _.find(newData, { id: node.parent });
          treeRef.current.open(node.id);
          newData.splice(_.indexOf(newData, node), 1, {
            ...node,
            data: { ...node.data, open: true },
          });
        }
      }
    },
    [treeData, treeRef]
  );

  // Update the node data with selected state
  const markNodeAsSelected = useCallback(
    (node) => {
      if (node && Array.isArray(treeData) && treeData.length) {
        const newData = [];
        for (let i = 0, l = treeData.length; i < l; i++) {
          if (treeData[i].data) {
            newData.push({
              ...treeData[i],
              data: { ...treeData[i].data, selected: node.id === treeData[i].id },
            });
          } else if (node.id === treeData[i].id) {
            newData.push({
              ...treeData[i],
              data: { selected: true },
            });
          } else {
            newData.push({ ...treeData[i] });
          }
        }
        setTreeData(newData);
      }
    },
    [treeData, setTreeData]
  );

  // ------------------------------------------------------------------
  // INIT SELECTED NODE
  // If SelectedNodeId is indicated then open node branch at init
  useEffect(() => {
    if (!initialized && treeRef.current && treeData && treeData.length && selectedNodeId) {
      openBranch(selectedNodeId);
      setInitialized(true);
      markNodeAsSelected(treeData.find((node) => node.id === selectedNodeId));
    }
  }, [selectedNodeId, treeRef, treeData, initialized]);

  // ------------------------------------------------------
  // INIT NODE SELECTION CALC
  const isSelected = useCallback(
    (node) => {
      if (!isDirty && node.id === selectedNodeId) {
        return true;
      }
      if (isDirty && node.id === selectedNode.id) {
        return true;
      }
      return false;
    },
    [isDirty, selectedNodeId]
  );

  // ------------------------------------------------------------------
  // HANDLERS
  const handleDrop = (newTree) => setTreeData(newTree);
  const handleCanDrop = (tree, { dragSource, dropTargetId, dropTarget }) => {
    if (allowDropOutside || dragSource?.parent === dropTargetId) {
      return true;
    }
    return false;
  };
  const handleCanDrag = (node) => {
    return !node.data?.selected;
  };
  const handleOnToggle = (node, isOpen, onToggle, onToggleEvent) => {
    if (!allowMultipleOpen && !isOpen) {
      setTimeout(() => {
        treeRef.current.closeAll();
        openBranch(node.id, true);
      });
    }
    // Prevent flickering filtering onToggle in just certain situations
    if (isOpen && node.parent === 0 && !allowMultipleOpen) {
      treeRef.current.closeAll();
    } else if (currentNode.current && currentNode.current.id === node.id) {
      onToggle(onToggleEvent);
    } else if (allowMultipleOpen) {
      onToggle(onToggleEvent);
    }

    currentNode.current = node;
  };

  const handleSelect = (node) => {
    setIsDirty(true);
    setSelectedNode(node);
    markNodeAsSelected(node);
  };

  return (
    <div className="relative flex">
      <Tree
        ref={treeRef}
        tree={treeData}
        rootId={0}
        render={(node, { depth, isOpen, onToggle }) => (
          <NodeRenderer
            node={node}
            treeData={treeData}
            setTreeData={setTreeData}
            depth={depth}
            isOpen={isOpen}
            onToggle={(e) => handleOnToggle(node, isOpen, onToggle, e)}
            isSelected={isSelected(node)}
            onSelect={handleSelect}
            allowDropOutside={allowDropOutside}
            allowMultipleOpen={allowMultipleOpen}
          />
        )}
        dragPreviewRender={(monitorProps) => <NodeDragPreview monitorProps={monitorProps} />}
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
        dropTargetOffset={20}
        placeholderRender={(node, { depth }) => (
          <NodePlaceholderRenderer node={node} depth={depth} />
        )}
      />
    </div>
  );
};

export default TreeContainer;
