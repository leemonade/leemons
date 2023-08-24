import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';

export const ModuleSetupContext = createContext();
export const useModuleSetupContext = () => useContext(ModuleSetupContext);

export function ModuleSetupContextProvider({ value: initialValue, children }) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);

  const setStateValue = useCallback(
    (newValue) => {
      let valueToSet = newValue;
      if (isFunction(newValue)) {
        valueToSet = newValue(stateRef.current);
      }

      setState(valueToSet);
      stateRef.current = valueToSet;
    },
    [stateRef, setState]
  );

  return (
    <ModuleSetupContext.Provider value={[state, setStateValue, stateRef]}>
      {children}
    </ModuleSetupContext.Provider>
  );
}

ModuleSetupContextProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.element,
};
