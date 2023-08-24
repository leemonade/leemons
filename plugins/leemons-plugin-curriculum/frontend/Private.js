import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const AddCurriculum = loadable(() => pMinDelay(import('./src/pages/private/AddCurriculum'), 1000));
/*
const AddCurriculumStep1 = loadable(() =>
  pMinDelay(import('./src/pages/private/AddCurriculumStep1'), 1000)
);
const AddCurriculumStep2 = loadable(() =>
  pMinDelay(import('./src/pages/private/AddCurriculumStep2'), 1000)
);
const AddCurriculumStep3 = loadable(() =>
  pMinDelay(import('./src/pages/private/AddCurriculumStep3'), 1000)
);

 */
const CurriculumView = loadable(() =>
  pMinDelay(import('./src/pages/private/CurriculumView'), 1000)
);
const ListCurriculum = loadable(() =>
  pMinDelay(import('./src/pages/private/ListCurriculum'), 1000)
);

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/new`}>
        <AddCurriculum session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/list`}>
        <ListCurriculum session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id/view`}>
        <CurriculumView session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id`}>
        <AddCurriculum session={session} fallback={<LoadingOverlay visible />} />
      </Route>
    </Switch>
  );
}

/*
      <Route path={`${path}/:id/step/1`}>
        <AddCurriculumStep1 session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id/step/2`}>
        <AddCurriculumStep2 session={session} fallback={<LoadingOverlay visible />} />
      </Route>
      <Route path={`${path}/:id/step/3`}>
        <AddCurriculumStep3 session={session} fallback={<LoadingOverlay visible />} />
      </Route> */
