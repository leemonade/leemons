import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';

const SelectProfile = loadable(() => import('./src/pages/private/SelectProfile'));

export default function Private() {
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${path}/select-profile`}>
          <SelectProfile />
        </Route>
      </Switch>
    </div>
  );
}
