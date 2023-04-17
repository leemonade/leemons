import { LoadingOverlay } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import { goLoginPage } from '@users/navigate';
import { useSession } from '@users/session';
import pMinDelay from 'p-min-delay';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const Logout = loadable(() => pMinDelay(import('./src/pages/public/Logout'), 1000));

const Home = loadable(() => pMinDelay(import('./src/pages/private/Home'), 1000));
const SelectProfile = loadable(() => pMinDelay(import('./src/pages/private/SelectProfile'), 1000));
const UserData = loadable(() => pMinDelay(import('./src/pages/private/UserData'), 1000));
const Welcome = loadable(() => pMinDelay(import('./src/pages/private/Welcome'), 1000));
const SocketTest = loadable(() => pMinDelay(import('./src/pages/private/SocketTest'), 1000));
const ChangeLanguage = loadable(() =>
  pMinDelay(import('./src/pages/private/ChangeLanguage'), 1000)
);

const ListProfiles = loadable(() =>
  pMinDelay(import('./src/pages/private/profiles/ListProfiles'), 1000)
);
const DetailProfile = loadable(() =>
  pMinDelay(import('./src/pages/private/profiles/DetailProfile'), 1000)
);

const ListRoles = loadable(() => pMinDelay(import('./src/pages/private/roles/ListRoles'), 1000));
const DetailRoles = loadable(() =>
  pMinDelay(import('./src/pages/private/roles/DetailRoles'), 1000)
);

const ListUsers = loadable(() => pMinDelay(import('./src/pages/private/users/ListUsers'), 1000));
const CreateUsers = loadable(() =>
  pMinDelay(import('./src/pages/private/users/CreateUsers'), 1000)
);
const ImportUsers = loadable(() =>
  pMinDelay(import('./src/pages/private/users/ImportUsers'), 1000)
);
const DetailUser = loadable(() => pMinDelay(import('./src/pages/private/users/DetailUser'), 1000));

const UserDataDatasetValues = loadable(() =>
  pMinDelay(import('./src/pages/private/UserDataDatasetValues'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/logout`}>
        <Logout session={session} fallback={<LoadingOverlay visible />} />
      </Route>
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
      <Route path={`${path}/select-profile`}>
        <SelectProfile session={session} fallback={<LoadingOverlay visible />} />
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
      <Route path={`${path}/set-dataset-values`}>
        <UserDataDatasetValues session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail/:userId`}>
        <DetailUser session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/detail`}>
        <DetailUser session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
