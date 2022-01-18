import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import React, { useState } from 'react';
import { Alert } from '@bubbles-ui/components';

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
  const Component = result
    ? () => (
        <Alert severity="error" closeable={false}>
          {result}
        </Alert>
      )
    : () => null;
  return [result, setState, Component, (error) => getRequestErrorMessage(error, t)];
}
