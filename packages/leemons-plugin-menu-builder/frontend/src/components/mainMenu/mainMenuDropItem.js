/*
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hooks from 'leemons-hooks';
import getInnerText from '../../helpers/getInnerText';
import DndItem from '../dnd/dndItem';

export default function MainMenuDropItem({ children, className, item }) {
  const [isEditMode, setEditMode] = useState(false);
  const goodChildren = _.isFunction(children)
    ? children({ isDragging: false, canDrag: false })
    : children;

  const _item = {
    ...item,
    menuKey: item.menuKey || 'plugins.menu-builder.main',
    url: item.url || window.location.pathname,
    label: item.label || getInnerText(goodChildren),
  };

  const onEditModeChange = ({ args }) => {
    setEditMode(args[0]);
  };

  useEffect(() => {
    hooks.addAction('menu-builder:edit-mode', onEditModeChange);
    hooks.fireEvent('menu-builder:emit-edit-mode');
    return () => {
      hooks.removeAction('menu-builder:edit-mode', onEditModeChange);
    };
  });

  if (isEditMode) {
    return (
      <DndItem className={className} type={'menu-item'} item={_item} emptyLayout={true}>
        {children}
      </DndItem>
    );
  }

  return <>{goodChildren}</>;
}

MainMenuDropItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  item: PropTypes.any,
};
*/
