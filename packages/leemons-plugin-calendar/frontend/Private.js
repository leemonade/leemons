import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Calendar = loadable(() => import('./src/pages/private/Calendar'));
const Kanban = loadable(() => import('./src/pages/private/Kanban'));

const CalendarConfigList = loadable(() => import('./src/pages/private/config/CalendarConfigList'));
const CalendarConfigDetail = loadable(() =>
  import('./src/pages/private/config/CalendarConfigDetail')
);
const CalendarConfigCalendar = loadable(() =>
  import('./src/pages/private/config/CalendarConfigCalendar')
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/home`}>
          <Calendar session={session} />
        </Route>
        <Route path={`${path}/kanban`}>
          <Kanban session={session} />
        </Route>
        <Route path={`${path}/config/calendars/:id`}>
          <CalendarConfigCalendar session={session} />
        </Route>
        <Route path={`${path}/config/detail/:id`}>
          <CalendarConfigDetail session={session} />
        </Route>
        <Route path={`${path}/config`}>
          <CalendarConfigList session={session} />
        </Route>
      </Switch>
    </div>
  );
}
