import React from 'react';
import { Switch as Routes, Route, useRouteMatch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

const Details = loadable(() => import('./src/components/Details/Details'));

export default function Private() {
  const { path } = useRouteMatch();

  return (
    <Routes>
      <Route path={`${path}/ongoing`}>
        <p>Ongoing</p>
      </Route>
      <Route path={`${path}/details/:id`}>
        <Details />
      </Route>

      <Route path={`${path}/`}>
        <Redirect to={`${path}/ongoing`} />
      </Route>
    </Routes>
  );
}
