import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import Login from './src/pages/public/Login';

const RegisterPassword = loadable(() =>
  pMinDelay(import('./src/pages/public/RegisterPassword'), 500)
);
const Recover = loadable(() => pMinDelay(import('./src/pages/public/Recover'), 500));
const Reset = loadable(() => pMinDelay(import('./src/pages/public/Reset'), 500));
const Logout = loadable(() => pMinDelay(import('./src/pages/protected/Logout'), 500));

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/register-password`}>
        <RegisterPassword fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/logout`}>
        <Logout fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/login`}>
        <Login fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/recover`}>
        <Recover fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/reset`}>
        <Reset fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}`}>
        <Redirect to={`/private/dashboard`} />
      </Route>
    </Switch>
  );
}
