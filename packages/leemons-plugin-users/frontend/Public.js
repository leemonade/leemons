import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import Login from './src/pages/public/Login';

// const Login = loadable(() => import('./src/pages/public/Login'));
const RegisterPassword = loadable(() => import('./src/pages/public/RegisterPassword'));
const Recover = loadable(() => import('./src/pages/public/Recover'));
const Reset = loadable(() => import('./src/pages/public/Reset'));

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/register-password`}>
        <RegisterPassword />
      </Route>
      <Route path={`${path}/login`}>
        <Login />
      </Route>
      <Route path={`${path}/recover`}>
        <Recover />
      </Route>
      <Route path={`${path}/reset`}>
        <Reset />
      </Route>
      <Route path={`${path}`}>
        <Redirect to={`/private${path}/home`} />
      </Route>
    </Switch>
  );
}
