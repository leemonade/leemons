import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import jsxToString from '../utils/jsx-to-string';
import { Tabs, Tab, TabList, TabPanel, useTabs } from './ui';

function Wrapper({ children, className, title, nocode, html }) {
  const [sourcecode, setSourcecode] = useState('');
  const component = useRef(null);
  const { activeIndex, setActiveIndex } = useTabs();

  useEffect(() => {
    if (!nocode && activeIndex == 1 && component.current) {
      setSourcecode(jsxToString(children));
    }
  }, [nocode, activeIndex, component]);

  return (
    <div className="py-2">
      <div className="pt-4 text-xs capitalize opacity-60">{title}</div>
      {!nocode ? (
        <Tabs activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
          <TabList>
            <Tab id="preview" panelId="previewPanel">
              Preview
            </Tab>
            <Tab id="code" panelId="codePanel">
              {html ? 'HTML' : 'React code'}
            </Tab>
          </TabList>
          <TabPanel id="previewPanel" tabId="preview" className="pt-2" forceRender>
            <div className="p-4">
              <div className={className} ref={component}>
                {children}
              </div>
            </div>
          </TabPanel>
          <TabPanel id="codePanel" tabId="code" className="pt-2">
            <div className="p-4">
              <Highlight className="html p-4 text-xs rounded-box">{sourcecode}</Highlight>
            </div>
          </TabPanel>
        </Tabs>
      ) : (
        <div className="pt-2">
          <div className="p-4">
            <div className={className} ref={component}>
              {children}
            </div>
          </div>
        </div>
      )}
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
