import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import _ from 'lodash';
import cln from 'classnames';

const TabsState = createContext();
const Elements = createContext();

const Tabs = ({ children, activeIndex, setActiveIndex, saveHistory, router }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const elements = useMemo(() => ({ tabs: 0, panels: 0, tabIds: [] }), []);
  const state = {
    activeIndex: activeIndex || currentIndex,
    setActiveIndex: setActiveIndex || setCurrentIndex,
    saveHistory,
    router,
  };

  return (
    <Elements.Provider value={elements}>
      <TabsState.Provider value={state}>
        <div className="flex flex-col">{children}</div>
      </TabsState.Provider>
    </Elements.Provider>
  );
};

const useTabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return { activeIndex, setActiveIndex };
};

const useTabState = () => {
  const { activeIndex, setActiveIndex } = useContext(TabsState);
  const elements = useContext(Elements);

  const tabIndex = useMemo(() => {
    const currentIndex = elements.tabs;
    elements.tabs += 1;

    return currentIndex;
  }, []);

  const registerTab = useCallback((id) => elements.tabIds.push(id), []);

  const onClick = useMemo(() => () => setActiveIndex(tabIndex), []);

  const state = useMemo(
    () => ({
      isActive: activeIndex === tabIndex,
      onClick,
      registerTab,
    }),
    [activeIndex, onClick, tabIndex]
  );

  return state;
};

const usePanelState = () => {
  const { activeIndex } = useContext(TabsState);
  const elements = useContext(Elements);

  const panelIndex = useMemo(() => {
    const currentIndex = elements.panels;
    elements.panels += 1;

    return currentIndex;
  }, []);

  return panelIndex === activeIndex;
};

const Tab = ({
  children,
  id,
  panelId,
  tabIndex,
  disabled,
  className,
  selectedClassName,
  disabledClassName,
}) => {
  const { isActive, onClick, registerTab } = useTabState();
  const { saveHistory, router } = useContext(TabsState);
  const { tabIds } = useContext(Elements);

  useEffect(() => registerTab(id), []);

  const handleClick = (e) => {
    onClick();
    if (!_.isNil(router)) {
      let currentPath = router.pathname;
      const query = {};

      for (const key in router.query) {
        if (currentPath.indexOf(`[${key}]`) > 0) {
          currentPath = currentPath.replace(`[${key}]`, router.query[key]);
        } else if (!tabIds.includes(key)) {
          query[key] = router.query[key];
        }
      }

      query[id] = true;

      router.push({ pathname: currentPath, query }, undefined, {
        shallow: saveHistory,
      });
    }
  };

  useEffect(() => {
    if (!isActive && !_.isNil(router)) {
      const query = router.query;
      if (!!query[id]) {
        onClick();
      }
    }
  }, [router]);

  return (
    <li>
      <button
        className={cln(className, {
          tab: true,
          [selectedClassName || 'tab-selected']: isActive,
          [disabledClassName || 'tab-disabled']: disabled,
        })}
        onClick={(e) => (disabled ? null : handleClick(e))}
        role="tab"
        id={id}
        type="button"
        aria-selected={isActive ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : 'false'}
        aria-controls={panelId}
        tabIndex={tabIndex || (isActive ? '0' : null)}
      >
        {children}
      </button>
    </li>
  );
};

const TabList = ({ children }) => {
  return (
    <ul role="tablist" className="tablist">
      {children}
    </ul>
  );
};

const TabPanel = ({ forceRender, children, id, tabId, className, selectedClassName, ...props }) => {
  const isActive = usePanelState();

  if (forceRender || isActive) {
    return (
      <div
        {...props}
        className={cln(className, {
          tabpanel: true,
          [selectedClassName || 'tabpanel-selected']: isActive,
          hidden: forceRender && !isActive,
        })}
        role="tabpanel"
        id={id}
        aria-labelledby={tabId}
      >
        {children}
      </div>
    );
  }
  return null;
};

export { Tabs, Tab, TabPanel, TabList, useTabs };
