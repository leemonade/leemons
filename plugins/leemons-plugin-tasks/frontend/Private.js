import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const TasksList = loadable(() => pMinDelay(import("./src/pages/private/TasksList"), 500));
const TaskDetail = loadable(() => pMinDelay(import("./src/pages/private/TaskDetail"), 500));
const TaskAssign = loadable(() => pMinDelay(import("./src/pages/private/TaskAssign"), 500));
const TaskView = loadable(() => pMinDelay(import("./src/pages/private/TaskView"), 500));
const TaskResult = loadable(() => pMinDelay(import("./src/pages/private/TaskResult"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="result/:id/:user"
        element={<TaskResult session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="result/:id"
        element={<TaskResult session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="view/:id/:user"
        element={<TaskView session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="view/:id"
        element={<TaskView session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="assign/:id"
        element={<TaskAssign session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="draft"
        element={<Navigate to="/private/leebrary/assignables.tasks/list?activeTab=draft" replace />}
      />
      <Route
        path=":id"
        element={<TaskDetail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=""
        element={<Navigate to="/private/leebrary/assignables.tasks/list" replace />}
      />
    </Routes>
  );
}
