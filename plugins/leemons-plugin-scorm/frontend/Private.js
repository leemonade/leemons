import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const ScormList = loadable(() => pMinDelay(import("./src/pages/List"), 500));
const ScormDetail = loadable(() => pMinDelay(import("./src/pages/Detail"), 500));
const ScormAssign = loadable(() => pMinDelay(import("./src/pages/Assign"), 500));
const ScormView = loadable(() => pMinDelay(import("./src/pages/View"), 500));
const ScormResult = loadable(() => pMinDelay(import("./src/pages/Result"), 500));
const ScormPreview = loadable(() => pMinDelay(import("./src/pages/Preview"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="preview/:id"
        element={<ScormPreview session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="result/:id"
        element={<ScormResult session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="result/:id/:user"
        element={<ScormResult session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="assign/:id"
        element={<ScormAssign session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="view/:id/:user"
        element={<ScormView session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=":id"
        element={<ScormDetail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=""
        element={<ScormList session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}
