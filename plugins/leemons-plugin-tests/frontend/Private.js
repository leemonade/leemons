import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const TestsList = loadable(() =>
  pMinDelay(import("./src/pages/private/tests/List"), 500)
);
const TestsEdit = loadable(() =>
  pMinDelay(import("./src/pages/private/tests/Edit"), 500)
);
const TestsAssign = loadable(() =>
  pMinDelay(import("./src/pages/private/tests/Assign"), 500)
);
const TestsDetail = loadable(() =>
  pMinDelay(import("./src/pages/private/tests/Detail"), 500)
);
const TestsResult = loadable(() =>
  pMinDelay(import("./src/pages/private/TestsResult"), 500)
);
const QuestionBanksList = loadable(() =>
  pMinDelay(import("./src/pages/private/questions-banks/List"), 500)
);
const QuestionBankDetail = loadable(() =>
  pMinDelay(import("./src/pages/private/QuestionBankDetail"), 500)
);
const StudentInstance = loadable(() =>
  pMinDelay(import("./src/pages/private/StudentInstance"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="result/:id/:user"
        element={<TestsResult session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="result/:id"
        element={<TestsResult session={session} fallback={<LoadingOverlay visible />} />}
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
        path="questions-banks/draft"
        element={<Navigate to="/private/leebrary/tests-questions-banks/list?activeTab=draft" replace />}
      />
      <Route
        path="questions-banks/:id"
        element={<QuestionBankDetail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="questions-banks"
        element={<Navigate to="/private/leebrary/tests-questions-banks/list" replace />}
      />
      <Route
        path="detail/:id"
        element={<TestsDetail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="assign/:id"
        element={<TestsAssign session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="draft"
        element={<Navigate to="/private/leebrary/assignables.tests/list?activeTab=draft" replace />}
      />
      <Route
        path=":id"
        element={<TestsEdit session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=""
        element={<Navigate to="/private/leebrary/assignables.tests/list" replace />}
      />
    </Routes>
  );
}
