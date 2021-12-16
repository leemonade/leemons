import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const AddCurriculumStep1 = loadable(() => import('./src/pages/private/AddCurriculumStep1'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      <Switch>
        <Route path={`${path}/new`}>
          <AddCurriculumStep1 session={session} />
        </Route>
        <Route path={`${path}/list`}>Listado</Route>
      </Switch>
    </div>
  );
}
