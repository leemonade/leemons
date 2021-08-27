import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useState } from 'react';
import { Alert } from 'leemons-ui';

export function getRequestErrorMessage(error, t) {
  let result = null;
  if (error.message) result = error.message;
  if (error.msg) result = error.msg;
  if (error.allowedPermissions && t) result = t('permission_error', error.allowedPermissions[0]);
  return result;
}

export default function useRequestErrorMessage() {
  const [state, setState] = useState();
  const { t } = useCommonTranslate('request_errors');
  let result = null;
  if (state) {
    result = getRequestErrorMessage(state, t);
  }
  const Component = result ? () => <Alert color="error">{result}</Alert> : () => null;
  return [
    result,
    setState,
    Component,
    (error) => {
      return getRequestErrorMessage(error, t);
    },
  ];
}
