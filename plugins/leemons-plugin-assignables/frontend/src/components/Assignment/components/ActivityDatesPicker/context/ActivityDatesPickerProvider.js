import React, { createContext, useContext } from "react";

import PropTypes from 'prop-types';

const context = createContext();

const { Provider } = context;

export const useActivityDatesPickerContext = () => useContext(context);

export function ActivityDatesPickerProvider({ values, children }) {
  return <Provider value={values}>{children}</Provider>;
}

ActivityDatesPickerProvider.propTypes = {
  values: PropTypes.object,
  children: PropTypes.node,
};
