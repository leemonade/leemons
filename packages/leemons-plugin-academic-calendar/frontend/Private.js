import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Config = loadable(() => pMinDelay(import('./src/pages/private/config/List'), 1000));
const RegionalCalendars = loadable(() =>
  pMinDelay(import('./src/pages/private/regional/index'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/config`}>
        <Config session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/regional-calendars`}>
        <RegionalCalendars session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
