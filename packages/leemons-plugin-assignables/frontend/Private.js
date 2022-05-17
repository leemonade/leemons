import React from 'react';
import { Switch as Routes, Route, useRouteMatch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Details = loadable(() => import('./src/components/Details'));
const Ongoing = loadable(() => import('./src/components/Ongoing'));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  const { path } = useRouteMatch();

  return (
    <Routes>
      <Route path={`${path}/ongoing`}>
        <Ongoing session={session} />
      </Route>
      <Route path={`${path}/details/:id`}>
        <Details session={session} />
      </Route>

      <Route path={`${path}/`}>
        <Redirect to={`${path}/ongoing`} />
      </Route>
    </Routes>
  );
}
