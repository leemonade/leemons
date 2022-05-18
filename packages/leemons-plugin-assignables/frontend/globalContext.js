import React from 'react';
import useIsTeacher from './src/components/Ongoing/AssignmentList/hooks/useIsTeacher';
import { Provider as LocalProvider } from './src/contexts/globalContext';

export function Provider({ children }) {
  const isTeacher = useIsTeacher();
  return (
    <LocalProvider
      value={{
        isTeacher,
      }}
    >
      {children}
    </LocalProvider>
  );
}

export default Provider;
