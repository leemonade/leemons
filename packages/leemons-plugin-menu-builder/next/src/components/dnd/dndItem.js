import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { getEmptyImage } from 'react-dnd-html5-backend';
import hooks from 'leemons-hooks';

export default function DndItem({ children, className, item, type, emptyLayout }) {
  let goodChildren = _.isFunction(children) ? children({ isDragging: false }) : children;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: {
      ...item,
      _tempId: Math.random().toString(16).slice(2),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    end: (dragItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        hooks.fireEvent('dnd:cancel', dragItem);
      }
    },
  }));

  useEffect(() => {
    if (emptyLayout) {
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, []);

  goodChildren = _.isFunction(children) ? children({ isDragging }) : children;

  return (
    <div ref={drag} className={className}>
      {goodChildren}
    </div>
  );
}

DndItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  item: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  emptyLayout: PropTypes.bool,
};
