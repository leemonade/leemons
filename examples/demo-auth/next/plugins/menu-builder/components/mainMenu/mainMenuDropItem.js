import { DndProvider, useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { HTML5Backend } from 'react-dnd-html5-backend';

function MainMenuDropItem_({ children, className, item }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'menu-item',
    item,
    end: (data, monitor) => {
      // const dropResult = monitor.getDropResult();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  return (
    <div ref={drag} className={className}>
      {_.isFunction(children) ? children({ isDragging }) : children}
    </div>
  );
}

MainMenuDropItem_.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  item: PropTypes.any,
};

export default function MainMenuDropItem({ children, ...rest }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MainMenuDropItem_ {...rest}>{children}</MainMenuDropItem_>
    </DndProvider>
  );
}

MainMenuDropItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  item: PropTypes.any,
};
