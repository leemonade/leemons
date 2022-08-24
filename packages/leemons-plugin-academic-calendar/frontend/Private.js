import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const RegionalCalendars = loadable(() =>
  pMinDelay(import('./src/pages/private/regional/index'), 1000)
);
const ProgramCalendars = loadable(() =>
  pMinDelay(import('./src/pages/private/program/index'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/config`}>
        <Redirect to={`${path}/program-calendars`} />
      </Route>
      <Route path={`${path}/regional-calendars`}>
        <RegionalCalendars session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/program-calendars`}>
        <ProgramCalendars session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
