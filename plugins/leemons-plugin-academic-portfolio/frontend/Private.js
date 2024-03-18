import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Welcome = loadable(() => pMinDelay(import('./src/pages/private/WelcomePage'), 500));
const Profiles = loadable(() => pMinDelay(import('./src/pages/private/ProfilesPage'), 500));
const Tree = loadable(() => pMinDelay(import('./src/pages/private/TreePage'), 500));
const ProgramList = loadable(() =>
  pMinDelay(import('./src/pages/private/programs/ProgramList'), 500)
);
const SubjectList = loadable(() =>
  pMinDelay(import('./src/pages/private/subjects/SubjectList'), 500)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/welcome`}>
        <Welcome session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/profiles`}>
        <Profiles session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/programs`}>
        <ProgramList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/subjects`}>
        <SubjectList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/tree`}>
        <Tree session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
