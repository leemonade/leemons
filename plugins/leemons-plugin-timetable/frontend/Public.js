import loadable from "@loadable/component";
import { Route, Routes } from "react-router-dom";

const Test = loadable(() => import("./src/pages/public/TestPage"));

export default function Public() {
  return (
    <Routes>
      <Route
        path="test"
        element={<Test />}
      />
    </Routes>
  );
}
