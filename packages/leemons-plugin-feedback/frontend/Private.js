import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const FeedbackDetail = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/Detail'), 1000)
);

const FeedbackList = loadable(() => pMinDelay(import('./src/pages/private/feedback/List'), 1000));

const FeedbackAssign = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/Assign'), 1000)
);
const StudentInstance = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/StudentInstance'), 1000)
);
const Result = loadable(() => pMinDelay(import('./src/pages/private/feedback/Result'), 1000));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/result/:id`}>
        <Result session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/student/:id/:user`}>
        <StudentInstance session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/student/:id`}>
        <StudentInstance session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/assign/:id`}>
        <FeedbackAssign session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id`}>
        <FeedbackDetail session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}`}>
        <FeedbackList session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}
