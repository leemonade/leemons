import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { XIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import Button from './Button';

function Modal({ isModalVisible, hide, options, children, className }) {
  const handleOverlayClicked = (e) => {
    if (e.target.className !== 'modal-wrapper') {
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

  const renderBody = () => {
    if (children) {
      return children;
    }
    if (options && options.message) {
      return (
        <div className="modal-body">
          <p>{options.message}</p>
        </div>
      );
    }
    return false;
  };

  const renderButtons = () => {
    const { buttons } = options;
    return (
      <div className="modal-action">
        {buttons.map((button) => (
          <React.Fragment key={shortid.generate()}>{button}</React.Fragment>
        ))}
      </div>
    );
  };

  const renderFooter = () => {
    const { cancelLabel, actionLabel, onAction, onCancel } = options;
    return (
      <div className="modal-action">
        {cancelLabel && (
          <Button
            color="ghost"
            className="text-black btn-sm"
            onClick={() => {
              if (onCancel) onCancel();
              hide();
            }}
          >
            {cancelLabel}
          </Button>
        )}
        {actionLabel && (
          <Button
            color="primary"
            className="btn-sm"
            onClick={() => {
              if (onAction) onAction();
              hide();
            }}
          >
            {actionLabel}
          </Button>
        )}
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

  const modalBodyClass = classNames({
    'modal-body': true,
    'modal-no-action': options?.buttons?.length === 0 || true,
  });

  return isModalVisible
    ? ReactDOM.createPortal(
        <>
          <div className="modal-overlay" />
          <div
            className={modalWrapperClass}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
            onClick={handleOverlayClicked}
          >
            <div className={`${modalClass} ${className}`}>
              <div className="modal-content">
                {options !== undefined && options.closeButton === false ? null : (
                  <div className="modal-header">
                    <div className="modal-title">{options?.title || ''}</div>
                    <Button
                      color="ghost"
                      circle
                      className="btn-xs"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        if (options?.onCancel) options.onCancel();
                        hide();
                      }}
                    >
                      <XIcon className="h-4 w-4 stroke-current" />
                    </Button>
                  </div>
                )}
                <div className={modalBodyClass}>{renderBody()}</div>
                {options?.buttons?.length > 0 && renderButtons()}
                {(options?.cancelLabel || options?.actionLabel) && renderFooter()}
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}

Modal.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  isModalVisible: PropTypes.bool,
  hide: PropTypes.any,
  options: PropTypes.shape({
    animated: PropTypes.bool,
    overlayClose: PropTypes.bool,
    onOverlayClicked: PropTypes.func,
    title: PropTypes.any,
    message: PropTypes.any,
    cancelLabel: PropTypes.any,
    actionLabel: PropTypes.any,
    onAction: PropTypes.func,
    onCancel: PropTypes.func,
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
      if (options && options.hide) {
        options.hide();
      }
      document.body.classList.remove('modal-open');
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShown]);

  return [
    {
      isShown,
      isModalVisible,
      hide: toggle,
      options,
    },
    toggle,
  ];
};
