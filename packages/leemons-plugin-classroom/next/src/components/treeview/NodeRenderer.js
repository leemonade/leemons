import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './NodeRenderer.module.css';
import cln from 'classnames';

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some((child) => child === younger || isDescendant(child, younger))
  );
}

const NodeRenderer = ({
  scaffoldBlockPxWidth,
  toggleChildrenVisibility,
  connectDragPreview,
  connectDragSource,
  isDragging,
  canDrop,
  canDrag,
  node,
  title,
  subtitle,
  draggedNode,
  path,
  treeIndex,
  isSearchMatch,
  isSearchFocus,
  icons,
  buttons,
  className,
  style,
  didDrop,
  swapFrom,
  swapLength,
  swapDepth,
  treeId, // Not needed, but preserved for other renderers
  isOver, // Not needed, but preserved for other renderers
  parentNode, // Needed for dndManager
  rowDirection,
  ...otherProps
}) => {
  const nodeTitle = title || node.title;
  const nodeSubtitle = subtitle || node.subtitle;
  const rowDirectionClass = rowDirection === 'rtl' ? 'rtl' : null;

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  let handle;
  if (canDrag) {
    if (typeof node.children === 'function' && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      handle = (
        <div className={styles.loadingHandle}>
          <div className={styles.loadingCircle}>
            {[...new Array(12)].map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={cln(styles.loadingCirclePoint, rowDirectionClass ?? '')}
              />
            ))}
          </div>
        </div>
      );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(
        <div className="py-3 px-1 cursor-move">
          <svg
            className={isDragging ? 'text-primary' : 'text-neutral'}
            width="14"
            height="6"
            viewBox="0 0 14 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.333332 4.33301H13.3333" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0.333332 1.6665H13.3333" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>,
        {
          dropEffect: 'copy',
        }
      );
    }
  }

  let buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };
  if (rowDirection === 'rtl') {
    buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
  }

  return (
    <div style={{ height: '100%' }} {...otherProps}>
      {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === 'function') && (
          <div>
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={cln(
                styles.collapsableButton,
                node.expanded ? styles.collapseButton : styles.expandButton,
                rowDirectionClass ?? ''
              )}
              style={buttonStyle}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                })
              }
            />

            {node.expanded && !isDragging && (
              <div
                style={{ width: scaffoldBlockPxWidth }}
                className={cln(styles.lineChildren, rowDirectionClass ?? '')}
              />
            )}
          </div>
        )}

      <div className={cln(styles.rowWrapper, rowDirectionClass ?? '')}>
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={cln(
              styles.row,
              isLandingPadActive ? styles.rowLandingPad : '',
              isLandingPadActive && !canDrop ? styles.rowCancelPad : '',
              isSearchMatch ? styles.rowSearchMatch : '',
              isSearchFocus ? styles.rowSearchFocus : '',
              rowDirectionClass ?? '',
              className ?? ''
            )}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style,
            }}
          >
            {handle}
            {isDragging && 'isDragging'}
            <div
              className={cln(
                styles.rowContents,
                !canDrag ? styles.rowContentsDragDisabled : '',
                rowDirectionClass ?? '',
                {
                  'bg-primary-100 border border-dashed border-primary rounded': node.type === 'new',
                  'bg-white': node.type !== 'new',
                }
              )}
            >
              {node.type === 'add' && buttons ? (
                buttons.add
              ) : (
                <>
                  <div className={cln(styles.rowLabel, rowDirectionClass ?? '')}>
                    <span
                      className={cln(
                        'font-medium',
                        styles.rowTitle,
                        node.subtitle ? styles.rowTitleWithSubtitle : '',
                        {
                          'text-primary': node.type === 'new' || isDragging,
                          'text-secondary-300': node.type !== 'new' && !isDragging,
                        }
                      )}
                    >
                      {typeof nodeTitle === 'function'
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex,
                          })
                        : nodeTitle}
                    </span>

                    {nodeSubtitle && (
                      <span className={styles.rowSubtitle}>
                        {typeof nodeSubtitle === 'function'
                          ? nodeSubtitle({
                              node,
                              path,
                              treeIndex,
                            })
                          : nodeSubtitle}
                      </span>
                    )}
                  </div>
                  {/* DELETE IS ONLY ALLOWED AT END OF HIERARCHY */}
                  {!node.children && node.type !== 'new' && buttons && (
                    <div className={styles.rowToolbar}>
                      <div className={styles.toolbarButton}>{buttons.delete}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

NodeRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  subtitle: null,
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
  rowDirection: 'ltr',
};

NodeRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
  rowDirection: PropTypes.string.isRequired,
};

export default NodeRenderer;
