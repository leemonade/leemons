import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { useSession } from '@users/session';
import { UserRedirect } from './src/components/UserRedirect';
import { LocaleContainer } from './src/components/LocaleContainer';

function goLoginPage(history, returnUrl) {
  const uri = '/admin/login';
  return returnUrl === true ? uri : history.push(uri);
}

const Setup = loadable(() => pMinDelay(import('./src/pages/private/Setup'), 1000));

export default function Private() {
  const { path } = useRouteMatch();
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <LocaleContainer>
      <Switch>
        <Route path={`${path}/setup`}>
          <UserRedirect to={<Setup session={session} fallback={<LoadingOverlay visible />} />} />
        </Route>
      </Switch>
    </LocaleContainer>
  );
}
