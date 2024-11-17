import React from 'react';
import { Switch as Routes, Route, useRouteMatch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';

import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Details = loadable(() => pMinDelay(import('./src/components/Details'), 500));
const Ongoing = loadable(() => pMinDelay(import('./src/components/Ongoing'), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  const { path } = useRouteMatch();

  return (
    <Routes>
      <Route path={`${path}/ongoing`}>
        <Ongoing key="ongoing" session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/details/:id`}>
        <Details session={session} fallback={<LoadingOverlay visible />} />
      </Route>

      <Route path={`${path}/`}>
        <Redirect to={`${path}/ongoing`} />
      </Route>
    </Routes>
  );
}
