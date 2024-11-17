import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';

const Test = loadable(() => import('./src/pages/public/TestPage'));

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/test`}>
        <Test />
      </Route>
    </Switch>
  );
}
