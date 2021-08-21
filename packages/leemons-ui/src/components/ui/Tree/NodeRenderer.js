import React, { useEffect, useState } from 'react';
import cln from 'classnames';
import { TrashIcon } from '@heroicons/react/solid';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Button from '../Button';
import { useDragOver } from '@minoru/react-dnd-treeview';

export const NodeRenderer = ({
  node,
  treeData,
  setTreeData,
  depth,
  isOpen,
  onToggle,
  isSelected,
  allowDropOutside,
  allowMultipleOpen,
  ...otherProps
}) => {
  const [lowerSiblingsCount, setLowerSiblingsCount] = useState(null);
  const [siblingIndex, setSiblingIndex] = useState(null);
  const { droppable, data } = node;
  const isButton = data?.type === 'button';
  const indent = (isButton ? Math.max(0, depth - 1) : depth) * 24 + (!droppable ? 10 : 0);

  const dragOverProps =
    allowDropOutside && allowMultipleOpen ? useDragOver(node.id, isOpen, onToggle) : {};

  // useEffect(() => droppable && console.log(isSelected, node), [isSelected, node]);

  const calculateLowerSiblingsCount = () => {
    const siblings = treeData.filter(
      (sibling) =>
        sibling.parent === node.parent && !sibling.data?.selected && sibling.data?.type !== 'button'
    );

    if (siblings && siblings.length) {
      let foundAt = 0;
      for (let i = 0, l = siblings.length; i < l; i++) {
        if (siblings[i].id === node.id) {
          foundAt = i;
          break;
        }
      }
      setSiblingIndex(foundAt);
      setLowerSiblingsCount(siblings.length - foundAt - 1);
    }
  };

  useEffect(() => {
    if (!droppable && node && treeData && treeData.length) {
      calculateLowerSiblingsCount();
    }
  }, [node, treeData, droppable]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (droppable) {
      onToggle(node.id);
    }
  };

  return (
    <div
      className={cln('tree-node relative flex items-center h-8 rounded group', {
        'bg-white hover:bg-gray-10 cursor-pointer': droppable && !isSelected,
        'border border-transparent hover:border-secondary pl-2':
          !droppable && !isSelected && !isButton,
        'bg-primary-100 border border-dashed border-primary pl-2': isSelected,
        'pr-2': !isButton,
      })}
      style={{ marginLeft: indent }}
      onClick={handleToggle}
      {...dragOverProps}
    >
      {/* TOGGLE ARROW */}
      {droppable && !isSelected && (
        <div
          className={`flex items-center justify-center group cursor-pointer transition-transform transform ease-linear h-6 w-8 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <svg
            className="text-gray-300 group-hover:text-secondary"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.2805 5.43C4.29449 5.44755 4.30952 5.46425 4.32551 5.48C4.50458 5.65892 4.74736 5.75943 5.00051 5.75943C5.25365 5.75943 5.49643 5.65892 5.67551 5.48C5.69149 5.46425 5.70652 5.44755 5.72051 5.43L9.2 0.7615C9.25274 0.690532 9.28471 0.606304 9.29235 0.51822C9.29999 0.430135 9.283 0.34166 9.24327 0.262672C9.20355 0.183685 9.14265 0.117293 9.06737 0.0709094C8.9921 0.0245258 8.90542 -2.42472e-05 8.81701 1.79704e-08H1.18551C1.09709 -2.42472e-05 1.01041 0.0245258 0.935135 0.0709094C0.859863 0.117293 0.798964 0.183685 0.759237 0.262672C0.71951 0.34166 0.702518 0.430135 0.710159 0.51822C0.717799 0.606304 0.749771 0.690532 0.802505 0.7615L4.2805 5.43Z"
              fill="currentColor"
            />
          </svg>
        </div>
      )}

      {!droppable && !isButton && (
        <>
          {/* NODE LINES */}
          <div
            className={cln(
              'tree-node_lines',
              'absolute bottom-0 left-0 border-b border-l border-gray-30 w-3',
              {
                'h-4': siblingIndex === 0,
                'h-8': siblingIndex > 0,
                'rounded-bl': lowerSiblingsCount === 0,
              }
            )}
            style={{ transform: 'translateX(-160%) translateY(-0.9rem)' }}
          />
          {/* DRAG HANDLER */}
          <div className="py-2 mr-2 group text-gray-30 group-hover:text-secondary-300 cursor-move">
            <svg
              width="14"
              height="6"
              viewBox="0 0 14 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.333332 4.33301H13.3333" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0.333332 1.6665H13.3333" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </>
      )}

      {/* TITLE */}
      {isButton ? (
        <div className="flex-1">
          <Button color="primary" text className="btn-sm w-full">
            <PlusCircleIcon className="text-primary w-4 h-4 mr-2" />
            <div className="flex-1 text-left">{`${node.text}`}</div>
          </Button>
        </div>
      ) : (
        <div
          className={cln('flex-1 text-sm', {
            'text-gray-300 group-hover:text-secondary': droppable && !isSelected,
            'text-primary': isSelected,
          })}
        >
          <span>{`${node.text}`}</span>
        </div>
      )}

      {/* DELETE BUTTON */}
      {!droppable && !isButton && (
        <div className="text-gray-30 group-hover:text-secondary-300 pl-6">
          <TrashIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
