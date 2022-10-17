import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Calendar = loadable(() => pMinDelay(import('./src/pages/private/Calendar'), 1000));
const Kanban = loadable(() => pMinDelay(import('./src/pages/private/Kanban'), 1000));

const CalendarConfigList = loadable(() =>
  pMinDelay(import('./src/pages/private/config/CalendarConfigList'), 1000)
);
const CalendarConfigDetail = loadable(() =>
  pMinDelay(import('./src/pages/private/config/CalendarConfigDetail'), 1000)
);
const CalendarConfigCalendar = loadable(() =>
  pMinDelay(import('./src/pages/private/config/CalendarConfigCalendar'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/home`}>
        <Calendar session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/kanban`}>
        <Kanban session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/config/calendars/:id`}>
        <CalendarConfigCalendar session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/config/detail/:id`}>
        <CalendarConfigDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/config`}>
        <CalendarConfigList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
