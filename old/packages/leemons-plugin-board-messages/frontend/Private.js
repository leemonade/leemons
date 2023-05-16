import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const List = loadable(() => pMinDelay(import('./src/pages/private/List'), 1000));
const Test = loadable(() => pMinDelay(import('./src/pages/private/test'), 1000));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/list`}>
        <List session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/test`}>
        <Test session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
