import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const FeedbackDetail = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/Detail'), 500)
);
const FeedbackAssign = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/Assign'), 500)
);
const StudentInstance = loadable(() =>
  pMinDelay(import('./src/pages/private/feedback/StudentInstance'), 500)
);
const Result = loadable(() => pMinDelay(import('./src/pages/private/feedback/Result'), 500));
const Preview = loadable(() => pMinDelay(import('./src/pages/private/feedback/Preview'), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="preview/:id"
        element={<Preview session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="result/:id"
        element={<Result session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="student/:id/:user"
        element={<StudentInstance session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="student/:id"
        element={<StudentInstance session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="assign/:id"
        element={<FeedbackAssign session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="draft"
        element={<Navigate to="/private/leebrary/assignables.feedback/list?activeTab=draft" replace />}
      />
      <Route
        path=":id"
        element={<FeedbackDetail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=""
        element={<Navigate to="/private/leebrary/assignables.feedback/list" replace />}
      />
    </Routes>
  );
}
