import { LoadingOverlay } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import { goLoginPage } from '@users/navigate';
import { useSession } from '@users/session';
import pMinDelay from 'p-min-delay';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const Home = loadable(() => pMinDelay(import('./src/pages/private/Home'), 500));
const UserData = loadable(() => pMinDelay(import('./src/pages/private/UserData'), 500));
const Welcome = loadable(() => pMinDelay(import('./src/pages/private/Welcome'), 500));
const SocketTest = loadable(() => pMinDelay(import('./src/pages/private/SocketTest'), 500));
const ChangeLanguage = loadable(() => pMinDelay(import('./src/pages/private/ChangeLanguage'), 500));

const ListProfiles = loadable(() =>
  pMinDelay(import('./src/pages/private/profiles/ListProfiles'), 500)
);
const DetailProfile = loadable(() =>
  pMinDelay(import('./src/pages/private/profiles/DetailProfile'), 500)
);

const ListRoles = loadable(() => pMinDelay(import('./src/pages/private/roles/ListRoles'), 500));
const DetailRoles = loadable(() => pMinDelay(import('./src/pages/private/roles/DetailRoles'), 500));

const ListUsers = loadable(() => pMinDelay(import('./src/pages/private/users/ListUsers'), 500));
const CreateUsers = loadable(() => pMinDelay(import('./src/pages/private/users/CreateUsers'), 500));
const ImportUsers = loadable(() => pMinDelay(import('./src/pages/private/users/ImportUsers'), 500));
const DetailUser = loadable(() =>
  pMinDelay(import('./src/pages/private/users/DetailUser/UserDetail'), 500)
);
const DetailInfo = loadable(() =>
  pMinDelay(import('./src/pages/private/users/DetailUser/UserInfo'), 500)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/home`}>
        <Home session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/list`}>
        <ListUsers session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/create`}>
        <CreateUsers session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/import`}>
        <ImportUsers session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/language`}>
        <ChangeLanguage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/user-data`}>
        <UserData session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/welcome`}>
        <Welcome session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/socket-test`}>
        <SocketTest session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/profiles/list`}>
        <ListProfiles session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/profiles/detail/:uri`}>
        <DetailProfile session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/profiles/detail`}>
        <DetailProfile session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/roles/list`}>
        <ListRoles session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/roles/detail/:uri`}>
        <DetailRoles session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/roles/detail`}>
        <DetailRoles session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail/:userId`}>
        <DetailUser session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail`}>
        <DetailInfo session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
