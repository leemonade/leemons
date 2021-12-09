import React from 'react';
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

export default function DndDropZone({ children, className, type, onDrop }) {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: type,
      drop: onDrop,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop]
  );

  return (
    <div ref={drop} className={className}>
      {_.isFunction(children) ? children({ canDrop, isOver }) : children}
    </div>
  );
}

DndDropZone.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
