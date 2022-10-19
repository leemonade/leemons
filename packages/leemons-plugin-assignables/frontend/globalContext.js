import React from 'react';
import useIsTeacher from './src/components/Ongoing/AssignmentList/hooks/useIsTeacher';
import useIsStudent from './src/components/Ongoing/AssignmentList/hooks/useIsStudent';
import { Provider as LocalProvider } from './src/contexts/globalContext';

export function Provider({ children }) {
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  return (
    <LocalProvider
      value={{
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </LocalProvider>
  );
}

export default Provider;
