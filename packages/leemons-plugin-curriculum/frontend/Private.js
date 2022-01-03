import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const AddCurriculum = loadable(() => import('./src/pages/private/AddCurriculum'));
const AddCurriculumStep1 = loadable(() => import('./src/pages/private/AddCurriculumStep1'));
const AddCurriculumStep2 = loadable(() => import('./src/pages/private/AddCurriculumStep2'));
const AddCurriculumStep3 = loadable(() => import('./src/pages/private/AddCurriculumStep3'));
const CurriculumView = loadable(() => import('./src/pages/private/CurriculumView'));
const ListCurriculum = loadable(() => import('./src/pages/private/ListCurriculum'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/new`}>
          <AddCurriculum session={session} />
        </Route>
        <Route path={`${path}/:id/step/1`}>
          <AddCurriculumStep1 session={session} />
        </Route>
        <Route path={`${path}/:id/step/2`}>
          <AddCurriculumStep2 session={session} />
        </Route>
        <Route path={`${path}/:id/step/3`}>
          <AddCurriculumStep3 session={session} />
        </Route>
        <Route path={`${path}/:id/view`}>
          <CurriculumView session={session} />
        </Route>
        <Route path={`${path}/list`}>
          <ListCurriculum session={session} />
        </Route>
      </Switch>
    </div>
  );
}
