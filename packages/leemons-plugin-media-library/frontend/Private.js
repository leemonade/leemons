import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import Upload from './src/pages/private/Test/upload';

const Test = loadable(() => import('./src/pages/private/Test'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/test`}>
          <Test session={session} />
        </Route>
        <Route path={`${path}/upload`}>
          <Upload />
        </Route>
      </Switch>
    </div>
  );
}
