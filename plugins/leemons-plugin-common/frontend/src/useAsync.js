import { useEffect } from 'react';
import { isFunction } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function useAsync(asyncFn, onSuccess = () => {}, onError = () => {}) {
  useEffect(() => {
    let isActive = true;
    if (isFunction(asyncFn)) {
      asyncFn()
        .then((data) => {
          if (isActive) onSuccess(data);
        })
        .catch((err) => {
          if (isActive) onError(err);
        });
    }
    return () => {
      isActive = false;
    };
  }, []);
}
