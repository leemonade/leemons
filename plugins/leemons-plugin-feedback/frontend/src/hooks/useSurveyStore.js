import { useState } from 'react';

function useSurveyStore(initialState) {
  const [state, setState] = useState(initialState);

  const setStoreValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return [state, setStoreValue];
}

export default useSurveyStore;
export { useSurveyStore };
