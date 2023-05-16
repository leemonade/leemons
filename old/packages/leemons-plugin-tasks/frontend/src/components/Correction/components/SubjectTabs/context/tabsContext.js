import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const context = createContext();
export default context;
const { Provider } = context;

export function TabProvider({ children }) {
  const [tabsState, setTabsState] = useState(null);

  const updateTabState = (id) => (newState) =>
    setTabsState((prevState) => ({
      ...prevState,
      [id]: newState,
    }));

  const getTabState = (id) => tabsState?.[id];

  return (
    <Provider
      value={{
        tabsState: getTabState,
        updateTabState,
      }}
    >
      {children}
    </Provider>
  );
}

TabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
