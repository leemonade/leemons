import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

function Drawer({ isShown, isVisible, hide, options, children }) {
  const handleOverlayClicked = (e) => {
    if (e.target.className.indexOf('draw-overlay') < 0) {
      return;
    }
    if (options === undefined && hide) {
      hide();
    } else {
      if (options.overlayClose !== false && hide) {
        hide();
      }
      if (options.onOverlayClicked) {
        options.onOverlayClicked();
      }
    }
  };

  const overlayClass = classNames({
    'draw-overlay': true,
    'modal-overlay': true,
    'z-10': true,
    transition: options && options.animated,
    'opacity-100': isVisible,
    'opacity-0': !isVisible,
    'ease-out': true,
  });

  const contentClass = classNames({
    'top-0': true,
    'right-0': options.side === 'right' || !options.side,
    'left-0': options.side === 'left',
    fixed: true,
    'h-screen': true,
    transform: options && options.animated,
    transition: options && options.animated,
    'translate-x-full': (!isVisible && options.side === 'right') || !options.side,
    '-translate-x-full': !isVisible && options.side === 'left',
    'bg-primary-content': true,
    'ease-out': true,
    'z-50': true,
  });

  return isShown
    ? ReactDOM.createPortal(
      <>
        <div className={overlayClass} onClick={handleOverlayClicked} />
        <div aria-modal aria-hidden tabIndex={-1} role="dialog" className={contentClass}>
          {children}
        </div>
      </>,
      document.body
    )
    : null;
}

Drawer.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  isShown: PropTypes.bool,
  isVisible: PropTypes.bool,
  hide: PropTypes.any,
  options: PropTypes.shape({
    animated: PropTypes.bool,
    overlayClose: PropTypes.bool,
    onOverlayClicked: PropTypes.func,
    side: PropTypes.oneOf(['right', 'left']),
  }),
};

export default Drawer;

export const useDrawer = (options) => {
  const [hasToggledBefore, setHasToggledBefore] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const isVisibleRef = useRef(isVisible);
  isVisibleRef.current = isVisible;
  let timeoutHack;

  function toggle() {
    timeoutHack = setTimeout(() => {
      setIsVisible(!isVisibleRef.current);
      clearTimeout(timeoutHack);
    }, 10);
    setIsShown(!isShown);
    setHasToggledBefore(true);
  }

  function handleKeyDown(event) {
    if (event.keyCode !== 27 || (options && options.keyboardClose === false)) return;
    toggle();
    if (options && options.onEscapeKeyDown) {
      options.onEscapeKeyDown();
    }
  }

  useEffect(() => {
    if (isShown) {
      if (options && options.onShow) {
        options.onShow();
      }
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('drawer-open');
    }
    if (!isShown && hasToggledBefore) {
      if (options && options.hide) {
        options.hide();
      }
      document.body.classList.remove('drawer-open');
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShown]);

  return [
    {
      isShown,
      isVisible,
      hide: toggle,
      options,
    },
    toggle,
  ];
};
