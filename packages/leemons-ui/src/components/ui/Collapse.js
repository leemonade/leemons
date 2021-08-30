import React from 'react';
import PropTypes from 'prop-types';

function Collapse({ children, titleClass, title, checkbox }) {
  return (
    <div className="collapse w-96" tabIndex={checkbox ? null : 0}>
      {checkbox && <input type="checkbox" />}
      <div className={`collapse-title text-xl font-medium ${titleClass}`}>{title}</div>
      <div className="collapse-content">
        {children || (
          <p>
            Collapse content reveals with focus. If you add a checkbox, you can control it using
            checkbox instead of focus. Or you can force-open/force-close using{' '}
            <span className="badge badge-outline">collapse-open</span> and{' '}
            <span className="badge badge-outline">collapse-close</span> classes.
          </p>
        )}
      </div>
    </div>
  );
}

Collapse.propTypes = {
  children: PropTypes.any,
  titleClass: PropTypes.string,
  title: PropTypes.string,
  checkbox: PropTypes.bool,
};

export default Collapse;
