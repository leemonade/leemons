import { useEffect } from 'react';

export function useAsync(asyncFn, onSuccess = () => {}, onError = () => {}) {
  useEffect(() => {
    let isActive = true;
    asyncFn()
      .then((data) => {
        if (isActive) onSuccess(data);
      })
      .catch((err) => {
        if (isActive) onError(err);
      });
    return () => {
      isActive = false;
    };
  }, [asyncFn, onSuccess, onError]);
}
