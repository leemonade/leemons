import { useState } from 'react';

function useAssetListStore(initialState) {
  const [state, setState] = useState(initialState);

  const setStoreValue = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return [state, setStoreValue];
}

export default useAssetListStore;
export { useAssetListStore };
