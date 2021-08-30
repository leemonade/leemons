import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { usePopperTooltip } from 'react-popper-tooltip';
import ReactDOM from 'react-dom';

function Tooltip({
  children,
  className,
  color,
  content,
  placement,
  followCursor,
  open,
  options,
  size,
}) {
  const [show, setShow] = useState(open);
  const colorClass = color ? `tooltip-${color}` : '';
  const sizeClass = size ? `tooltip-${size}` : '';
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement,
    visible: show,
    followCursor,
    ...options,
  });

  const childrenWrapped = React.cloneElement(children, {
    ref: setTriggerRef,
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
  });

  const tooltip =
    typeof document !== 'undefined' && visible
      ? ReactDOM.createPortal(
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: `tooltip-container ${colorClass} ${sizeClass} ${className || ''}`,
            })}
          >
            <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            {content}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {childrenWrapped}
      {tooltip}
    </>
  );
}

Tooltip.defaultProps = { placement: 'auto', followCursor: false, open: false, options: {} };

Tooltip.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  content: PropTypes.any,
  followCursor: PropTypes.bool,
  open: PropTypes.bool,
  size: PropTypes.string,
  placement: PropTypes.oneOf([
    'auto',
    'auto-start',
    'auto-end',
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
    'left',
    'left-start',
    'left-end',
  ]),
  options: PropTypes.object,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'accent',
    'ghost',
    'info',
    'warning',
    'success',
    'error',
  ]),
  outlined: PropTypes.bool,
};

export default Tooltip;
