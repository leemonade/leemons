import * as _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import getInnerText from '../../helpers/getInnerText';
import DndItem from '../dnd/dndItem';

export default function MainMenuDropItem({ children, className, item }) {
  const goodChildren = _.isFunction(children) ? children({ isDragging: false }) : children;

  const _item = {
    ...item,
    menuKey: item.menuKey || 'plugins.menu-builder.main',
    url: item.url || Router?.router?.route,
    label: item.label || getInnerText(goodChildren),
  };

  return (
    <DndItem className={className} type={'menu-item'} item={_item} emptyLayout={true}>
      {children}
    </DndItem>
  );
}

MainMenuDropItem.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  item: PropTypes.any,
};
