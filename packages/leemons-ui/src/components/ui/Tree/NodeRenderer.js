import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cln from 'classnames';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useDragOver } from '@leemonade/react-dnd-treeview';
import Button from '../Button';
import NodeActions from './NodeActions';

export default function NodeRenderer({
  node,
  depth,
  isOpen,
  onToggle,
  isSelected,
  allowDropOutside,
  allowMultipleOpen,
  allowDragParents,
  onAdd,
  onSelect,
  hasChild,
  lowerSiblingsCount,
  hasOpenSiblings,
  siblingIndex,
  ...otherProps
}) {
  const [showButton, setShowButton] = useState(false);
  const [hover, setHover] = useState(false);
  const { type } = node;
  const isButton = type === 'button';
  const indent = (isButton ? Math.max(0, depth - 1) : depth) * 24 + (!hasChild ? 10 : 0);
  const dragOverProps =
    allowDropOutside && allowMultipleOpen ? useDragOver(node.id, isOpen, onToggle) : {};

  useEffect(() => {
    if (!hasOpenSiblings && isButton) {
      setShowButton(true);
    }
    if (hasOpenSiblings && isButton) {
      setShowButton(false);
    }
  }, [hasOpenSiblings, showButton, isButton]);

  // ----------------------------------------------------------------------
  // HANDLERS

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChild) {
      onToggle(node.id);
    }
  };
  const handleSelect = (e) => {
    e.stopPropagation();
    if (node.data?.action !== 'add') {
      onSelect(node, () => handleToggle(e));
    }
  };

  const handleOnAdd = () => {
    if (onAdd && node.data?.action === 'add') {
      onAdd(node);
    }
  };
  return (
    <div
      className={cln('tree-node relative flex items-center h-8 rounded group', {
        'bg-whitecursor-pointer': hasChild && !isSelected,
        'bg-gray-10': hover && !isButton,
        'border border-transparent hover:border-secondary pl-2':
          !hasChild && !isSelected && !isButton,
        'bg-primary-100 border border-dashed border-primary pl-2': isSelected,
        'transition-all ease-out transform': isButton,
        'pr-2': !isButton,
        hidden: isButton && hasOpenSiblings,
        'opacity-0 -translate-x-2': isButton && !showButton,
        'opacity-100': isButton && showButton,
      })}
      style={{ marginLeft: indent }}
      onClick={handleSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      {...dragOverProps}
    >
      {/* TOGGLE ARROW */}
      {hasChild && !isSelected && (
        <div
          onClick={handleToggle}
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

      {/* NODE LINES */}
      {!hasChild && !isButton && !isSelected && (
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
      )}

      {/* DRAG HANDLER */}
      {!isButton &&
        !isSelected &&
        ((allowDragParents && !isOpen && !hasOpenSiblings) || !hasChild) && (
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
        )}

      {/* TITLE */}
      {isButton ? (
        <div className="flex-1 pr-1">
          <Button color="primary" text className="btn-sm w-full mb-1" onClick={handleOnAdd}>
            <PlusCircleIcon className="text-primary w-4 h-4 mr-2" />
            <div className="flex-1 text-left">{`${node.text}`}</div>
          </Button>
        </div>
      ) : (
        <div
          className={cln('flex-1 text-sm', {
            'text-gray-300 group-hover:text-secondary': hasChild && !isSelected,
            'text-primary': isSelected,
          })}
        >
          <span>{`${node.text}`}</span>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <NodeActions node={node} {...otherProps} hover={hover} />
    </div>
  );
}

NodeRenderer.propTypes = {
  node: PropTypes.object,
  isOpen: PropTypes.bool,
  isSelected: PropTypes.bool,
  allowDropOutside: PropTypes.bool,
  allowMultipleOpen: PropTypes.bool,
  allowDragParents: PropTypes.bool,
  hasChild: PropTypes.bool,
  hasOpenSiblings: PropTypes.bool,
  depth: PropTypes.number,
  lowerSiblingsCount: PropTypes.number,
  siblingIndex: PropTypes.number,
  onToggle: PropTypes.func,
  onAdd: PropTypes.func,
  onSelect: PropTypes.func,
};
