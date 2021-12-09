import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Welcome = loadable(() => import('./src/pages/private/Welcome'));
const Tree = loadable(() => import('./src/pages/private/Tree'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/welcome`}>
          <Welcome session={session} />
        </Route>
        <Route path={`${path}/tree`}>
          <Tree session={session} />
        </Route>
      </Switch>
    </div>
  );
}
