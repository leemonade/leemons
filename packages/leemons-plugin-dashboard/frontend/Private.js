import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Dashboard = loadable(() => import('./src/pages/private/Dashboard'));
const ClassDashboard = loadable(() => import('./src/pages/private/ClassDashboard'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/class/:id`}>
          <ClassDashboard session={session} />
        </Route>
        <Route path={`${path}`}>
          <Dashboard session={session} />
        </Route>
      </Switch>
    </div>
  );
}
