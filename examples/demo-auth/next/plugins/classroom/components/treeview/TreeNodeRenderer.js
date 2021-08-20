import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styles from './TreeNodeRenderer.module.css';
import cln from 'classnames';

const TreeNodeRenderer = ({
  children,
  swapFrom,
  swapLength,
  swapDepth,
  scaffoldBlockPxWidth,
  lowerSiblingCounts,
  connectDropTarget,
  isOver,
  draggedNode,
  canDrop,
  treeIndex,
  treeId,
  listIndex,
  rowDirection,
  getPrevRow, // Delete from otherProps
  node, // Delete from otherProps
  path, // Delete from otherProps
  ...otherProps
}) => {
  const [state, setState] = useState({});
  const handleMouseOver = () => {
    if (!state.highlight) {
      setState({ highlight: true });
    }
  };

  const handleMouseLeave = () => {
    setState({ highlight: false });
  };

  const rowDirectionClass = rowDirection === 'rtl' ? 'rtl' : null;

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length;
  const scaffold = [];
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = '';
    if (lowerSiblingCount > 0) {
      // At this level in the tree, the nodes had sibling nodes further down

      if (listIndex === 0) {
        // Top-left corner of the tree
        // +-----+
        // |     |
        // |  +--+
        // |  |  |
        // +--+--+
        // lineClass = cln(styles.lineHalfHorizontalRight, styles.lineHalfVerticalBottom);
      } else if (lowerSiblingCount === 1 && i === scaffoldBlockCount - 1 && !node.children) {
        lineClass = cln(styles.lineHalfVerticalTop, styles.lineHalfHorizontalRight);
      } else if (i === scaffoldBlockCount - 1) {
        // Last scaffold block in the row, right before the row content
        // +--+--+
        // |  |  |
        // |  +--+
        // |  |  |
        // +--+--+
        if (!Array.isArray(node.children) || node.children.length === 0) {
          lineClass = cln(styles.lineHalfHorizontalRight, styles.lineFullVertical);
        }
      } else {
        // Simply connecting the line extending down to the next sibling on this level
        // +--+--+
        // |  |  |
        // |  |  |
        // |  |  |
        // +--+--+
        // lineClass = styles.lineFullVertical;
      }
    } else if (listIndex === 0) {
      // Top-left corner of the tree, but has no siblings
      // +-----+
      // |     |
      // |  +--+
      // |     |
      // +-----+
      // lineClass = styles.lineHalfHorizontalRight;
    } else if (i === scaffoldBlockCount - 1) {
      // The last or only node in this level of the tree
      // +--+--+
      // |  |  |
      // |  +--+
      // |     |
      // +-----+
      if (
        (!Array.isArray(node.children) || node.children.length === 0) &&
        !['add', 'new'].includes(node.type)
      ) {
        lineClass = cln(styles.lineHalfVerticalTop, styles.lineHalfHorizontalRight);
      }
    }

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth }}
        className={cln(styles.lineBlock, lineClass, rowDirectionClass ?? '')}
      />
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = '';

      if (listIndex === swapFrom + swapLength - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = styles.highlightBottomLeftCorner;
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = styles.highlightTopLeftCorner;
      } else {
        // This block is between the bottom and top
        highlightLineClass = styles.highlightLineVertical;
      }

      let style;
      if (rowDirection === 'rtl') {
        style = {
          width: scaffoldBlockPxWidth,
          right: scaffoldBlockPxWidth * i,
        };
      } else {
        // Default ltr
        style = {
          width: scaffoldBlockPxWidth,
          left: scaffoldBlockPxWidth * i,
        };
      }

      scaffold.push(
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={style}
          className={cln(styles.absoluteLineBlock, highlightLineClass, rowDirectionClass ?? '')}
        />
      );
    }
  });

  let style;
  const offset = scaffoldBlockPxWidth * scaffoldBlockCount;
  if (rowDirection === 'rtl') {
    style = { right: offset, width: `calc(100% - ${offset}px` };
  } else {
    // Default ltr
    style = { left: offset, width: `calc(100% - ${offset}px` };
  }

  return connectDropTarget(
    <div {...otherProps} className={cln(styles.node, rowDirectionClass ?? '')}>
      {scaffold}

      <div className={styles.nodeContent} style={style}>
        {Children.map(children, (child) =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode,
          })
        )}
      </div>
    </div>
  );
};

TreeNodeRenderer.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
  rowDirection: 'ltr',
};

TreeNodeRenderer.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  treeId: PropTypes.string.isRequired,
  listIndex: PropTypes.number.isRequired,
  rowDirection: PropTypes.string,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
};

export default TreeNodeRenderer;
