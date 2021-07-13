import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function DndItem({ children, className, item, type, emptyLayout }) {
  let goodChildren = _.isFunction(children) ? children({ isDragging: false }) : children;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
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
