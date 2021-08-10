import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { useState } from 'react';
import { Alert } from 'leemons-ui';

export default function useRequestErrorMessage() {
  const [state, setState] = useState();
  const { t } = useCommonTranslate('request_errors');
  let result = null;
  if (state) {
    if (state.message) result = state.message;
    if (state.msg) result = state.msg;
    if (state.allowedPermissions) result = t('permission_error', state.allowedPermissions[0]);
  }
  const Component = result ? () => <Alert color="error">{result}</Alert> : () => null;
  return [result, setState, Component];
}
