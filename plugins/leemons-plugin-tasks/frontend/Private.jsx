import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { useSearchParams } from '@common';

const AssignmentPage = loadable(() =>
  pMinDelay(import('./src/pages/private/assignment/AssignmentPage'), 500)
);
const Welcome = loadable(() => pMinDelay(import('./src/pages/private/welcome/WelcomePage'), 500));
const Library = loadable(() => pMinDelay(import('./src/pages/private/library/LibraryPage'), 500));
const SetupTask = loadable(() =>
  pMinDelay(import('./src/pages/private/library/TaskSetupPage'), 500)
);
const Profiles = loadable(() =>
  pMinDelay(import('./src/pages/private/profiles/ProfilesPage'), 500)
);
const UserDetails = loadable(() => pMinDelay(import('./src/pages/private/student/Details'), 500));
const Correction = loadable(() =>
  pMinDelay(import('./src/pages/private/assignment/Correction'), 500)
);

export default function Private() {
  const { path } = useRouteMatch();
  const query = useSearchParams();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      {/* ADMIN VIEW */}
      <Route path={`${path}/welcome`}>
        <Welcome session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/profiles`}>
        <Profiles session={session} fallback={<LoadingOverlay visible />} />
      </Route>

      {/* TEACHER VIEW */}
      <Route path={`${path}/library/edit/:id`}>
        <SetupTask session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/library/create`}>
        <SetupTask session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/library/view/:id`}>
        <UserDetails session={session} fallback={<LoadingOverlay visible />} preview />
      </Route>
      <Route path={`${path}/library/assign/:id`}>
        <AssignmentPage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/library`}>
        <Library session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/correction/:instance/:student`}>
        <Correction session={session} fallback={<LoadingOverlay visible />} />
      </Route>

      {/* STUDENT VIEW */}
      <Route path={`${path}/student-detail/:id/:user`}>
        <UserDetails session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
