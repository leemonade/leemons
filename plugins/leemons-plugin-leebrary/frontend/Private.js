import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const HomePage = loadable(() => pMinDelay(import('./src/pages/private/library/Library'), 1000));
const TestPage = loadable(() => pMinDelay(import('./src/pages/private/test'), 1000));
const UploadPage = loadable(() => pMinDelay(import('./src/pages/private/test/upload'), 1000));
const TestPermissionsPage = loadable(() =>
  pMinDelay(import('./src/pages/private/test/PermissionsData'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/test-permissions/:asset`}>
        <TestPermissionsPage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/test`}>
        <TestPage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/upload`}>
        <UploadPage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/`}>
        <HomePage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
