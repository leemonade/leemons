import React from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';
import loadable from '@loadable/component';

const Page1 = loadable(() => import("./src/components/Page"));

export default function index() {
  const {path} = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${path}/1`}>
          <Page1 fallback="Loading..."/>
        </Route>
        <Route path={`${path}/2`}>
          <p>2</p>
        </Route>
      </Switch>
      <p>This is users!</p>
    </div>
  )
}
