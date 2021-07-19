import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import shortid from 'shortid';
import PropTypes from 'prop-types';

function Modal({ show, onHide, options, children }) {
  const handleOverlayClicked = (e) => {
    if (e.target.className !== 'modal-wrapper') {
      return;
    }
    if (options === undefined && onHide) {
      onHide();
    } else {
      if (options.overlayClose !== false && onHide) {
        onHide();
      }
      if (options.onOverlayClicked) {
        options.onOverlayClicked();
      }
    }
  };

  const renderBody = () => {
    if (children) {
      return children;
    }
    if (options && options.message) {
      return (
        <div className="modal-content">
          <p>{options.message}</p>
        </div>
      );
    }
    return false;
  };

  const renderFooter = () => {
    const { buttons } = options;
    return (
      <div className="modal-action">
        {buttons.map((button) => (
          <React.Fragment key={shortid.generate()}>{button}</React.Fragment>
        ))}
      </div>
    );
  };

  const modalWrapperClass = classNames({
    'modal-wrapper': true,
    'modal-wrapper-centered': options && options.centered,
  });

  const modalClass = classNames({
    modal: true,
    'modal-lg': options && options.large,
    'modal-animated modal-animation-fade-in': options && options.animated,
  });

  return show
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className={modalWrapperClass}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            onClick={handleOverlayClicked}
          >
            <div className={modalClass}>
              <div className="modal-box">
                {options !== undefined && options.closeButton === false ? null : (
                  <div className="modal-header">
                    {options !== undefined && options.title !== undefined && (
                      <div className="modal-title">{options.title}</div>
                    )}
                    <button
                      type="button"
                      className="modal-close-button"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={onHide}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}
                <div className="modal-body">{renderBody()}</div>
                {options && options.buttons && options.buttons.length > 0 && renderFooter()}
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
}

Modal.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  show: PropTypes.bool,
  onHide: PropTypes.any,
  options: PropTypes.objectOf({
    overlayClose: PropTypes.any,
    onOverlayClicked: PropTypes.func,
    title: PropTypes.any,
    message: PropTypes.any,
  }),
};

export default Modal;

export const useModal = (options) => {
  const [hasToggledBefore, setHasToggledBefore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const isModalVisibleRef = useRef(isModalVisible);
  isModalVisibleRef.current = isModalVisible;
  let timeoutHack;

  function toggle() {
    timeoutHack = setTimeout(() => {
      setIsModalVisible(!isModalVisibleRef.current);
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
      document.body.classList.add('modal-open');
    }
    if (!isShown && hasToggledBefore) {
      if (options && options.onHide) {
        options.onHide();
      }
      document.body.classList.remove('modal-open');
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShown]);

  return [
    {
      isShown,
      show: isModalVisible,
      onHide: toggle,
      options,
    },
    toggle,
  ];
};
