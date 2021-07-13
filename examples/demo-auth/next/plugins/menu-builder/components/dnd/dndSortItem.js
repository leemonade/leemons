import React from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import * as _ from 'lodash';

export default function DndSortItem({ children, className, id, find, move, endMove, type }) {
  const originalIndex = find(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        const lastIndex = find(item.id).index;
        if (!didDrop) move(item.id, item.originalIndex);
        endMove(item.id, !didDrop ? item.originalIndex : lastIndex);
      },
    }),
    [id, originalIndex, move]
  );
  const [, drop] = useDrop(
    () => ({
      accept: type,
      canDrop: () => false,
      hover({ id: draggedId }) {
        if (draggedId !== id) move(draggedId, find(id).index);
      },
    }),
    [find, move]
  );

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
  endMove: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
