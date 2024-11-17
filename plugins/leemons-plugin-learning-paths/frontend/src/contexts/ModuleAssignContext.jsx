import React, { createContext, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useForm, useWatch as useRhfWatch } from 'react-hook-form';

export const ModuleAssignContext = createContext();
export const useModuleAssignContext = () => useContext(ModuleAssignContext);

export function ModuleAssignContextProvider({ value: defaultValues = {}, children }) {
  const form = useForm({ defaultValues });

  const useWatch = useCallback(
    (props) => useRhfWatch({ ...props, control: form.control }),
    [form.control]
  );

  return (
    <ModuleAssignContext.Provider value={{ ...form, useWatch }}>
      {children}
    </ModuleAssignContext.Provider>
  );
}

ModuleAssignContextProvider.propTypes = {
  value: PropTypes.any,
  children: PropTypes.element,
};
