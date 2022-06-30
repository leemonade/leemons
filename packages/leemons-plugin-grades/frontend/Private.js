import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const Welcome = loadable(() => pMinDelay(import('./src/pages/private/WelcomePage'), 1000));
const EvaluationList = loadable(() =>
  pMinDelay(import('./src/pages/private/Evaluations/EvaluationList'), 1000)
);
const PromotionsList = loadable(() =>
  pMinDelay(import('./src/pages/private/Promotions/PromotionsList'), 1000)
);
const DependenciesList = loadable(() =>
  pMinDelay(import('./src/pages/private/Dependencies/DependenciesList'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/welcome`}>
        <Welcome session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/evaluations`}>
        <EvaluationList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/promotions`}>
        <PromotionsList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/dependencies`}>
        <DependenciesList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
