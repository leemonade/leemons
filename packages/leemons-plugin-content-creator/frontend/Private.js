import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const DocumentList = loadable(() => pMinDelay(import('./src/pages/List'), 1000));
const DocumentDetail = loadable(() => pMinDelay(import('./src/pages/Detail'), 1000));
const DocumentAssign = loadable(() => pMinDelay(import('./src/pages/Assign'), 1000));
const DocumentView = loadable(() => pMinDelay(import('./src/pages/View'), 1000));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/:id/assign`}>
        <DocumentAssign session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/view/:id/:user`}>
        <DocumentView session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/view/:id`}>
        <DocumentView session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/new`}>
        <DocumentDetail session={session} fallback={<LoadingOverlay visible />} isNew key="new" />
      </Route>
      <Route path={`${path}/:id/edit`}>
        <DocumentDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id/view`}>
        <DocumentDetail session={session} fallback={<LoadingOverlay visible />} readOnly />
      </Route>
      <Route path={`${path}`}>
        <DocumentList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
