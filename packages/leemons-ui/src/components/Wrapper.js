import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import jsxToString from '../utils/jsx-to-string';

function Wrapper({ children, className, title, nocode, html }) {
  const [showcode, setShowcode] = useState(false);
  const [sourcecode, setSourcecode] = useState('');
  const component = useRef(null);

  useEffect(() => {
    if (!nocode && showcode && component.current) {
      setSourcecode(jsxToString(children));
    }
  }, [nocode, showcode, component]);

  return (
    <div className="py-2">
      <div className="pt-4 text-xs capitalize opacity-60">{title}</div>
      {!nocode && (
        <div className="mt-2 text-xs tabs">
          <div
            className={`tab tab-lifted ${!showcode && 'tab-active'}`}
            onClick={() => setShowcode(false)}
          >
            Preview
          </div>
          <div
            className={`tab tab-lifted ${showcode && 'tab-active'}`}
            onClick={() => setShowcode(true)}
          >
            {html ? 'HTML' : 'React code'}
          </div>
          <div className="flex-1 cursor-default tab tab-lifted"></div>
        </div>
      )}
      <div>
        {!nocode && showcode && (
          <div className="pt-2">
            <div className="p-4">
              <Highlight className="html p-4 text-xs rounded-box">{sourcecode}</Highlight>
            </div>
          </div>
        )}

        <div className={`pt-2 ${showcode && 'hidden'}`}>
          <div className="p-4">
            <div className={className} ref={component}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Wrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  title: PropTypes.string,
  nocode: PropTypes.bool,
  html: PropTypes.bool,
};

export default Wrapper;
