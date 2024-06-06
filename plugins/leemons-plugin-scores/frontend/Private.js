import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const EvaluationNotebookPage = loadable(() => import('@scores/pages/EvaluationNotebookPage'));
const PeriodsPage = loadable(() => import('@scores/pages/PeriodsPage'));
const WeightsPage = loadable(() => import('@scores/pages/WeightsPage'));
const ReviewerPage = loadable(() => import('@scores/pages/__DEPRECATED__/ReviewerPage'));
const MyScores = loadable(() => import('@scores/pages/MyScoresPage'));

export default function Private() {
  const { path } = useRouteMatch();
  useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route exact path={`${path}/weights`}>
        <WeightsPage />
      </Route>
      <Route exact path={`${path}/periods`}>
        <PeriodsPage />
      </Route>
      <Route exact path={`${path}/scores`}>
        <MyScores />
      </Route>
      <Route exact path={`${path}/notebook`}>
        <EvaluationNotebookPage />
      </Route>
      <Route exact path={`${path}/notebook/review`}>
        <ReviewerPage />
      </Route>
    </Switch>
  );
}
