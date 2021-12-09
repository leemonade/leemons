import React from 'react';
import { useDragLayer } from 'react-dnd';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

const dndLayers = {};

export function registerDndLayer(type, component) {
  dndLayers[type] = component;
}

export function getDndLayer(type) {
  if (Object.prototype.hasOwnProperty.call(dndLayers, type)) {
    return dndLayers[type];
  }
  return null;
}

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export default function DndLayer() {
  const { isDragging, item, initialOffset, currentOffset, itemType } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  function renderItem() {
    const layer = getDndLayer(itemType);
    return _.isFunction(layer) ? layer({ item, isDragging }) : layer;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>{renderItem()}</div>
    </div>
  );
}

DndLayer.propTypes = {
  children: PropTypes.any,
};
