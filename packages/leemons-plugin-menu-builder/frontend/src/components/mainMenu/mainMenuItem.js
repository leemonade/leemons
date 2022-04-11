/*
import * as PropTypes from 'prop-types';
import React from 'react';
import { Button, ImageLoader, Tooltip } from 'leemons--ui';

export default function MainMenuItem({ item, menuWidth, active, onClick }) {
  return (
    <>
      <Tooltip color="primary" position="right" size="lg" content={item.label}>
        <Button
          onClick={(e) => (item.disabled ? e.preventDefault() : onClick(e))}
          style={{ height: menuWidth }}
          color="secondary"
          className={`w-full text-center hover:bg-primary-focus sharp border-0 ${
            active ? 'bg-secondary-focus' : ''
          } ${item.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
        >
          <div className={'w-5 h-full mx-auto relative'}>
            <ImageLoader
              className={`${
                active
                  ? 'stroke-current text-secondary-content'
                  : 'stroke-current text-secondary-content'
              }`}
              src={active && item.activeIconSvg ? item.activeIconSvg : item.iconSvg}
              alt={item.iconAlt}
            />
          </div>
        </Button>
      </Tooltip>
    </>
  );
}

MainMenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  menuWidth: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};
*/
