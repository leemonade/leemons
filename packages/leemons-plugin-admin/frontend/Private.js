import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { LoadingOverlay } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LocaleContainer } from './src/components/LocaleContainer';
import { UserRedirect } from './src/components/UserRedirect';

const Setup = loadable(() => pMinDelay(import('./src/pages/private/Setup'), 1000));

export default function Private() {
  const { path } = useRouteMatch();

  return (
    <LocaleContainer>
      <Switch>
        <Route path={`${path}/setup`}>
          <UserRedirect to={<Setup fallback={<LoadingOverlay visible />} />} />
        </Route>
      </Switch>
    </LocaleContainer>
  );
}
