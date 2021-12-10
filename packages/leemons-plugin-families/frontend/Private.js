import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const FamiliesList = loadable(() => import('./src/pages/private/FamiliesList'));
const FamilyDetail = loadable(() => import('./src/pages/private/FamilyDetail'));
const FamiliesConfig = loadable(() => import('./src/pages/private/FamiliesConfig'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/list`}>
          <FamiliesList session={session} />
        </Route>
        <Route path={`${path}/detail/:id`}>
          <FamilyDetail session={session} />
        </Route>
        <Route path={`${path}/detail`}>
          <FamilyDetail session={session} />
        </Route>
        <Route path={`${path}/config`}>
          <FamiliesConfig session={session} />
        </Route>
      </Switch>
    </div>
  );
}
