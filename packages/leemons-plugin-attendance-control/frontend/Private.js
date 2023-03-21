import { goLoginPage } from '@users/navigate';
import { useSession } from '@users/session';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/attendance`}>Miau</Route>
    </Switch>
  );
}
