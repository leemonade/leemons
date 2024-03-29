import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const ScormList = loadable(() => pMinDelay(import('./src/pages/List'), 500));
const ScormDetail = loadable(() => pMinDelay(import('./src/pages/Detail'), 500));
const ScormAssign = loadable(() => pMinDelay(import('./src/pages/Assign'), 500));
const ScormView = loadable(() => pMinDelay(import('./src/pages/View'), 500));
const ScormResult = loadable(() => pMinDelay(import('./src/pages/Result'), 500));
const ScormPreview = loadable(() => pMinDelay(import('./src/pages/Preview'), 500));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/preview/:id`}>
        <ScormPreview session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route exact path={`${path}/result/:id`}>
        <ScormResult session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route exact path={`${path}/result/:id/:user`}>
        <ScormResult session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/assign/:id`}>
        <ScormAssign session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/view/:id/:user`}>
        <ScormView session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id`}>
        <ScormDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}`}>
        <ScormList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
