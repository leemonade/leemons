import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const TestPage = loadable(() => import('./src/pages/private/test'));
const UploadPage = loadable(() => import('./src/pages/private/test/upload'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/home`}>
          <TestPage session={session} />
        </Route>
        <Route path={`${path}/test`}>
          <TestPage session={session} />
        </Route>
        <Route path={`${path}/upload`}>
          <UploadPage session={session} />
        </Route>
      </Switch>
    </div>
  );
}
