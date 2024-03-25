import { LoadingOverlay } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import { goLoginPage } from '@users/navigate';
import { useSession } from '@users/session';
import pMinDelay from 'p-min-delay';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const Logout = loadable(() => pMinDelay(import('./src/pages/protected/Logout'), 500));
const SelectProfile = loadable(() => pMinDelay(import('./src/pages/protected/SelectProfile'), 500));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/logout`}>
        <Logout session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/select-profile`}>
        <SelectProfile session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
