import { Route, Routes } from "react-router-dom";

import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";

const EvaluationNotebookPage = loadable(() => import("@scores/pages/EvaluationNotebookPage"));
const PeriodsPage = loadable(() => import("@scores/pages/PeriodsPage"));
const WeightsPage = loadable(() => import("@scores/pages/WeightsPage"));
const ReviewerPage = loadable(() => import("@scores/pages/__DEPRECATED__/ReviewerPage"));
const MyScores = loadable(() => import("@scores/pages/MyScoresPage"));

export default function Private() {
  useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="weights"
        element={<WeightsPage />}
      />
      <Route
        path="periods"
        element={<PeriodsPage />}
      />
      <Route
        path="scores"
        element={<MyScores />}
      />
      <Route
        path="notebook"
        element={<EvaluationNotebookPage />}
      />
      <Route
        path="notebook/review"
        element={<ReviewerPage />}
      />
    </Routes>
  );
}
