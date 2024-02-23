import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import { UserRedirect } from './src/components/UserRedirect';
import { LocaleContainer } from './src/components/LocaleContainer';

const Welcome = loadable(() => pMinDelay(import('./src/pages/public/Welcome'), 500));
const Signup = loadable(() => pMinDelay(import('./src/pages/public/Signup'), 500));
const Login = loadable(() => pMinDelay(import('./src/pages/public/Login'), 500));

// ----------------------------------------------------------------------------
// PUBLIC ROUTES

export default function Public() {
  const { path } = useRouteMatch();

  return (
    <LocaleContainer>
      <Switch>
        <Route path={`${path}/welcome`}>
          <UserRedirect to={<Welcome fallback={<LoadingOverlay visible />} />} />
        </Route>
        <Route path={`${path}/signup`}>
          <UserRedirect to={<Signup fallback={<LoadingOverlay visible />} />} />
        </Route>
        <Route path={`${path}/login`}>
          <UserRedirect to={<Login fallback={<LoadingOverlay visible />} />} />
        </Route>
        <Route path={`${path}`}>
          <UserRedirect />
        </Route>
      </Switch>
    </LocaleContainer>
  );
}
