import React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Tree from './tree';
import Organization from './organization';

export default function index() {
  const { path } = useRouteMatch();

  return (
    <div>
      <p>Classroom</p>
      <Switch>
        <Route path={`${path}/tree`}>
          <p>Hola</p>
          <Tree />
        </Route>
        <Route path={`${path}/organization`}>
          <Organization />
        </Route>
      </Switch>

      <Link to="/classroom/tree">Tree</Link>
      <br />
      <Link to="/classroom/organization">Organization</Link>
    </div>
  );
}
