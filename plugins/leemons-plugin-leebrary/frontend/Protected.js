import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const PlayerPage = loadable(() => pMinDelay(import('./src/pages/protected/player'), 1000));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/player/:assetId`}>
        <PlayerPage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}