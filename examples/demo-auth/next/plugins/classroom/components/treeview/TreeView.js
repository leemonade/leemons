import React, { useState, useEffect, useMemo } from 'react';
import SortableTree from '@nosferatu500/react-sortable-tree';
import ThreeViewTheme from '@classroom/components/treeview/Theme';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { TrashIcon } from '@heroicons/react/solid';
import { Button } from 'leemons-ui';
import { setParents, expandBranch, getExpandedNode, getNodeById } from '../../utils/TreeDataUtils';

export default function TreeView({
  treeData,
  setTreeData,
  onAddNode,
  onDeleteNode,
  multipleExpanded,
  ...otherProps
}) {
  const handleUpdateTree = (data) => {
    setTreeData(data);
  };

  const handleNodeClick = (event, rowInfo) => {
    if (
      event.target.className.includes('collapseButton') ||
      event.target.className.includes('expandButton')
    ) {
      // Close others branches and keep open just the clicked
      if (!rowInfo.node.expanded && !multipleExpanded) {
        const clickedNode = getNodeById(treeData, rowInfo.node.id);
        setParents(treeData);
        expandBranch(treeData, clickedNode);
        setTreeData([...treeData]);
      }
    }
  };

  const handleDrag = (data) => {
    return !data.node.children && !['add', 'new'].includes(data.node.type);
  };

  const handleDrop = ({ nextPath, prevPath }) => {
    return (
      String(nextPath.slice(0, nextPath.length - 1)) ===
      String(prevPath.slice(0, prevPath.length - 1))
    );
  };

  return (
    <SortableTree
      {...otherProps}
      generateNodeProps={(rowInfo) => ({
        onClick: (e) => handleNodeClick(e, rowInfo),
        buttons: {
          add: (
            <Button color="primary" text onClick={() => onAddNode(rowInfo)}>
              <div className="flex items-center">
                <PlusCircleIcon className="w-5 h-5 text-primary mr-2" />
                {rowInfo.node.title}
              </div>
            </Button>
          ),
          delete: (
            <Button
              color="neutral"
              text
              circle
              className="btn-xs"
              onClick={() => onDeleteNode(rowInfo)}
            >
              <TrashIcon className="w-4 h-4 text-neutral" />
            </Button>
          ),
        },
      })}
      isVirtualized={false}
      treeData={treeData}
      onChange={handleUpdateTree}
      canDrag={handleDrag}
      canDrop={handleDrop}
      theme={ThreeViewTheme}
    />
  );
}
