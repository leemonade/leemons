import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import * as _ from 'lodash';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function DndSortItem({
  children,
  className,
  id,
  find,
  move,
  type,
  accept,
  emptyLayout,
}) {
  const originalIndex = find(id).index;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        const lastIndex = find(item.id).index;
        move(item.id, !didDrop ? item.originalIndex : lastIndex, true);
      },
    }),
    [id, originalIndex, move]
  );
  const [, drop] = useDrop(
    () => ({
      accept: accept || type,
      canDrop: () => false,
      hover({ id: draggedId, ...rest }) {
        if (draggedId !== id) move(draggedId || rest, find(id).index);
      },
    }),
    [find, move]
  );

  useEffect(() => {
    if (emptyLayout) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, []);

  const goodChildren = _.isFunction(children) ? children({ isDragging }) : children;

  return (
    <div ref={(node) => drag(drop(node))} className={className}>
      {goodChildren}
    </div>
  );
}

DndSortItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  find: PropTypes.func.isRequired,
  move: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  accept: PropTypes.array,
  emptyLayout: PropTypes.bool,
};
