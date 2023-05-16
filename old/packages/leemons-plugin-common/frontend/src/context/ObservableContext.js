import React, { createContext, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm, useWatch as useRhfWatch } from 'react-hook-form';

export const ObervableContext = createContext();
export const useObservableContext = () => useContext(ObervableContext);

export function ObservableContextProvider({ value: defaultValues = {}, children }) {
  const form = useForm({ defaultValues });

  const useWatch = useCallback(
    (props) => useRhfWatch({ ...props, control: form.control }),
    [form.control]
  );

  return (
    <ObervableContext.Provider value={{ ...form, useWatch }}>{children}</ObervableContext.Provider>
  );
}

ObservableContextProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.element,
};
