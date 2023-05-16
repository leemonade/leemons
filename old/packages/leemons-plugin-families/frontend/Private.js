import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const FamiliesList = loadable(() => pMinDelay(import('./src/pages/private/FamiliesList'), 1000));
const FamilyDetail = loadable(() => pMinDelay(import('./src/pages/private/FamilyDetail'), 1000));
const FamiliesConfig = loadable(() =>
  pMinDelay(import('./src/pages/private/FamiliesConfig'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/list`}>
        <FamiliesList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail/:id`}>
        <FamilyDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail`}>
        <FamilyDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/config`}>
        <FamiliesConfig session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
