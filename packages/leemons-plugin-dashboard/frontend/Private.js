import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Dashboard = loadable(() => pMinDelay(import('./src/pages/private/Dashboard'), 1000));
const ClassDashboard = loadable(() =>
  pMinDelay(import('./src/pages/private/ClassDashboard'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/class/:id`}>
        <ClassDashboard session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}`}>
        <Dashboard session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
