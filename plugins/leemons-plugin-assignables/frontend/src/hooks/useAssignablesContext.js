import { useContext } from 'react';
import assignablesContext from '../contexts/globalContext';

export default function useAssignablesContext() {
  return useContext(assignablesContext);
}
