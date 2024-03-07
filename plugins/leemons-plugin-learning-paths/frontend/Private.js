import React from 'react';

import { LoadingOverlay } from '@bubbles-ui/components';

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

import { goLoginPage } from '@users/navigate';
import { useSearchParams } from '@common';
import { useSession } from '@users/session';
import { ModuleJourney } from '@learning-paths/pages/private/ModuleJourney/ModuleJourney';

const Library = loadable(() => pMinDelay(import('./src/pages/private/Library'), 500));
const ModuleSetupPage = loadable(() =>
  pMinDelay(import('./src/pages/private/ModuleSetupPage'), 500)
);
const ModuleAssignPage = loadable(() =>
  pMinDelay(import('./src/pages/private/ModuleAssignPage'), 500)
);

const ModuleDashboardPage = loadable(() =>
  pMinDelay(import('./src/pages/private/ModuleDashboardPage'), 500)
);

const ModuleJourneyPage = loadable(() =>
  pMinDelay(import('./src/pages/private/ModuleJourney/ModuleJourney'), 500)
);

function Fallback() {
  return <LoadingOverlay visible />;
}

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });
  const query = useSearchParams();
  return (
    <Switch>
      {/* MODULES */}
      <Route path={`${path}/modules/library`}>
        <Library session={session} fallback={<Fallback />} />
      </Route>
      <Route path={`${path}/modules/new`}>
        <ModuleSetupPage session={session} key="new" fallback={<Fallback />} />
      </Route>
      <Route path={`${path}/modules/:id/view`}>
        <ModuleDashboardPage session={session} fallback={<Fallback />} preview />
      </Route>
      <Route path={`${path}/modules/:id/edit`}>
        <ModuleSetupPage
          session={session}
          key={query.has('fromNew') ? 'new' : 'edit'}
          fallback={<Fallback />}
        />
      </Route>
      <Route path={`${path}/modules/:id/assign`}>
        <ModuleAssignPage session={session} fallback={<Fallback />} />
      </Route>
      <Route path={`${path}/modules/dashboard/:id`}>
        <ModuleDashboardPage session={session} fallback={<Fallback />} />
      </Route>
      <Route path={`${path}/modules/journey/:id`}>
        <ModuleJourneyPage session={session} fallback={<Fallback />} />
      </Route>
    </Switch>
  );
}
