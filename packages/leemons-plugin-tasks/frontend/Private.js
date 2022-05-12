import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const AssignmentPage = loadable(() => import('./src/pages/private/assignment/AssignmentPage'));
const Welcome = loadable(() => import('./src/pages/private/welcome/WelcomePage'));
const Library = loadable(() => import('./src/pages/private/library/LibraryPage'));
const SetupTask = loadable(() => import('./src/pages/private/library/TaskSetupPage'));
const Profiles = loadable(() => import('./src/pages/private/profiles/ProfilesPage'));
const Ongoing = loadable(() => import('./src/pages/private/ongoing/OngoingPage'));
const History = loadable(() => import('./src/pages/private/ongoing/HistoryPage'));
const UserDetails = loadable(() => import('./src/pages/private/student/Details'));
const Correction = loadable(() => import('./src/pages/private/assignment/Correction'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      {/* ADMIN VIEW */}
      <Route path={`${path}/welcome`}>
        <Welcome session={session} />
      </Route>
      <Route path={`${path}/profiles`}>
        <Profiles session={session} />
      </Route>

      {/* TEACHER VIEW */}
      <Route path={`${path}/library/edit/:id`}>
        <SetupTask session={session} />
      </Route>
      <Route path={`${path}/library/create`}>
        <SetupTask session={session} />
      </Route>
      <Route path={`${path}/library/assign/:id`}>
        <AssignmentPage session={session} />
      </Route>
      <Route path={`${path}/library`}>
        <Library session={session} />
      </Route>
      <Route path={`${path}/ongoing`}>
        <Ongoing session={session} />
      </Route>
      <Route path={`${path}/history`}>
        <History session={session} />
      </Route>
      <Route path={`${path}/correction/:instance/:student`}>
        <Correction session={session} />
      </Route>

      {/* STUDENT VIEW */}
      <Route path={`${path}/student-detail/:id`}>
        <UserDetails session={session} />
      </Route>
    </Switch>
  );
}
