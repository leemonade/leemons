import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Home = loadable(() => import('./src/pages/private/Home'));
const SelectProfile = loadable(() => import('./src/pages/private/SelectProfile'));
const UserData = loadable(() => import('./src/pages/private/UserData'));
const Welcome = loadable(() => import('./src/pages/private/Welcome'));
const SocketTest = loadable(() => import('./src/pages/private/SocketTest'));

const ListProfiles = loadable(() => import('./src/pages/private/profiles/ListProfiles'));
const DetailProfile = loadable(() => import('./src/pages/private/profiles/DetailProfile'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/home`}>
        <Home session={session} />
      </Route>
      <Route path={`${path}/select-profile`}>
        <SelectProfile session={session} />
      </Route>
      <Route path={`${path}/user-data`}>
        <UserData session={session} />
      </Route>
      <Route path={`${path}/welcome`}>
        <Welcome session={session} />
      </Route>
      <Route path={`${path}/socket-test`}>
        <SocketTest session={session} />
      </Route>
      <Route path={`${path}/profiles/list`}>
        <ListProfiles session={session} />
      </Route>
      <Route path={`${path}/profiles/detail/:uri`}>
        <DetailProfile session={session} />
      </Route>
      <Route path={`${path}/profiles/detail`}>
        <DetailProfile session={session} />
      </Route>
    </Switch>
  );
}
