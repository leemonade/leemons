import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const OnboarderForm = loadable(() => import('./src/onboarderForm'));
const Preferences = loadable(() => import('./src/pages/private/preferences'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/preference`}>
        <Preferences session={session} />
      </Route>
      <Route path={`${path}/onboarder`}>
        <OnboarderForm session={session} />
      </Route>
    </Switch>
  );
}
