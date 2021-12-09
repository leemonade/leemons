import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('./src/pages/public/Login'));
const Recover = loadable(() => import('./src/pages/public/Recover'));
const Reset = loadable(() => import('./src/pages/public/Reset'));

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
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
    </div>
  );
}
