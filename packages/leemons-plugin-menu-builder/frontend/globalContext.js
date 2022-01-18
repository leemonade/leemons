import React from 'react';
import PropTypes from 'prop-types';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export function Provider({ children }) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default Provider;
