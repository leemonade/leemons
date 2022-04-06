import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

const QuestionBanksList = loadable(() => import('./src/pages/private/questions-banks/List'));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Switch>
      <Route path={`${path}/questions-banks`}>
        <QuestionBanksList session={session} />
      </Route>
    </Switch>
  );
}
