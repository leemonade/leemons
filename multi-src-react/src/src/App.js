import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import loadable from "@loadable/component";

const Component = loadable(() =>
  import(/* webpackChunkName: "Component" */ "@plugins/src/Component")
);
const Lib2 = loadable(() =>
  import(/* webpackChunkName: "lib2" */ "@plugins/lib2")
);
// const Lib1 = loadable(() =>
//   import(/* webpackChunkName: "lib1" */ "@plugins/lib1/react")
// );

export default function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Suspense fallback={<p>Loading Home</p>}>
              <Component />
            </Suspense>
          </Route>
          <Route path="/lib1">
            <Suspense fallback={<p>Loading Lib1</p>}>
              <Lib1 />
            </Suspense>
          </Route>
          <Route path="/lib2">
            <Suspense fallback={<p>Loading Lib2</p>}>
              <Lib2 />
            </Suspense>
          </Route>
        </Switch>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Link to="/lib1">Go to Lib1</Link>
          <Link to="/lib2">Go to Lib2</Link>
          <Link to="/">Go to Home</Link>
        </div>
      </Router>
    </>
  );
}
