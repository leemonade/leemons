import loadable from '@loadable/component';
import { goLoginPage } from '@users/navigate';
import { useSession } from '@users/session';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const AssistancePage = loadable(() => import('@attendance-control/pages/private/Assistance'));

export default function Private() {
  const { path } = useRouteMatch();
  useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/attendance`}>
        <AssistancePage />
      </Route>
    </Switch>
  );
}
