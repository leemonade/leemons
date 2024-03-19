import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import AssignAssetPage from '@leebrary/pages/private/assignables/AssignAssetPage';
import Execution from '@leebrary/pages/private/assignables/Execution';
import Correction from '@leebrary/pages/private/assignables/Correction';

const HomePage = loadable(() => pMinDelay(import('./src/pages/private/library/Library'), 500));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/assign/:id`}>
        <AssignAssetPage fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/activities/student-detail/:id/:user`}>
        <Execution />
      </Route>
      <Route path={`${path}/activities/correction/:id/:user`}>
        <Correction />
      </Route>
      <Route path={`${path}/`}>
        <HomePage session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
