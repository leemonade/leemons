import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';

const Login = loadable(() => import('./src/pages/public/Login'));

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${path}/login`}>
          <Login />
        </Route>
      </Switch>
    </div>
  );
}
