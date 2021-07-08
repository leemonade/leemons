import * as _ from 'lodash';
import { DndProvider, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { HTML5Backend } from 'react-dnd-html5-backend';

function MainMenuDropZone_({ children, className }) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'menu-item',
    drop: (item) => {
      console.log('Dropped', item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className={className}>
      {_.isFunction(children) ? children({ canDrop, isOver }) : children}
    </div>
  );
}

MainMenuDropZone_.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default function MainMenuDropZone({ children, ...rest }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MainMenuDropZone_ {...rest}>{children}</MainMenuDropZone_>
    </DndProvider>
  );
}

MainMenuDropZone.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};
